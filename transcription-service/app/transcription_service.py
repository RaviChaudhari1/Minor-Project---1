
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import tempfile
import os
import whisper
import pymongo
from pymongo import MongoClient
from datetime import datetime
import logging
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for MERN app integration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/your_mern_app')
WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'base')  # tiny, base, small, medium, large
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB limit

# Initialize MongoDB connection
try:
    client = MongoClient(MONGODB_URI)
    db = client.get_default_database()
    transcriptions_collection = db.transcriptions
    logger.info("Connected to MongoDB successfully")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    db = None
    transcriptions_collection = None

# Initialize Whisper model
try:
    model = whisper.load_model(WHISPER_MODEL)
    logger.info(f"Loaded Whisper model: {WHISPER_MODEL}")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    model = None

def download_audio_from_url(url, max_size=MAX_FILE_SIZE):
    """
    Download audio file from URL (like Cloudinary)

    Args:
        url (str): Public URL of the audio file
        max_size (int): Maximum file size allowed

    Returns:
        str: Path to downloaded temporary file
    """
    try:
        # Set headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        # Stream download to check size
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()

        # Check content length
        content_length = response.headers.get('content-length')
        if content_length and int(content_length) > max_size:
            raise ValueError(f"File too large: {content_length} bytes")

        # Create temporary file
        suffix = '.mp3'  # Default suffix
        if 'content-type' in response.headers:
            content_type = response.headers['content-type']
            if 'mp4' in content_type:
                suffix = '.mp4'
            elif 'wav' in content_type:
                suffix = '.wav'
            elif 'flac' in content_type:
                suffix = '.flac'

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)

        # Download in chunks
        downloaded = 0
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                downloaded += len(chunk)
                if downloaded > max_size:
                    temp_file.close()
                    os.unlink(temp_file.name)
                    raise ValueError(f"File too large: {downloaded} bytes")
                temp_file.write(chunk)

        temp_file.close()
        logger.info(f"Downloaded audio file: {downloaded} bytes")
        return temp_file.name

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download audio: {e}")
        raise
    except Exception as e:
        logger.error(f"Error downloading audio: {e}")
        raise

def transcribe_audio_file(file_path):
    """
    Transcribe audio file using Whisper

    Args:
        file_path (str): Path to audio file

    Returns:
        dict: Transcription result
    """
    if not model:
        raise Exception("Whisper model not loaded")

    try:
        logger.info(f"Starting transcription of: {file_path}")
        result = model.transcribe(file_path)

        return {
            'text': result['text'].strip(),
            'language': result['language'],
            'segments': result.get('segments', []),
            'duration': sum(segment.get('end', 0) for segment in result.get('segments', []))
        }
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise

def store_transcription_in_db(audio_url, transcription_data, user_id=None):
    """
    Store transcription result in MongoDB

    Args:
        audio_url (str): Original audio URL
        transcription_data (dict): Transcription result from Whisper
        user_id (str): Optional user ID

    Returns:
        str: Transcription document ID
    """
    if not transcriptions_collection:
        raise Exception("Database not connected")

    try:
        document = {
            '_id': str(uuid.uuid4()),
            'audio_url': audio_url,
            'transcription': transcription_data['text'],
            'language': transcription_data['language'],
            'segments': transcription_data['segments'],
            'duration': transcription_data.get('duration', 0),
            'created_at': datetime.utcnow(),
            'user_id': user_id,
            'status': 'completed'
        }

        result = transcriptions_collection.insert_one(document)
        logger.info(f"Stored transcription in database: {document['_id']}")
        return document['_id']

    except Exception as e:
        logger.error(f"Failed to store transcription: {e}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'whisper_model': WHISPER_MODEL,
        'database_connected': transcriptions_collection is not None,
        'model_loaded': model is not None
    })

@app.route('/transcribe-url', methods=['POST'])
def transcribe_from_url():
    """
    Main endpoint to transcribe audio from URL
    Expected JSON: {
        "audio_url": "https://res.cloudinary.com/...",
        "user_id": "optional_user_id"
    }
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.get_json()
        audio_url = data.get('audio_url')
        user_id = data.get('user_id')

        if not audio_url:
            return jsonify({'error': 'audio_url is required'}), 400

        # Download audio file
        logger.info(f"Processing transcription request for URL: {audio_url}")
        temp_file_path = download_audio_from_url(audio_url)

        try:
            # Transcribe audio
            transcription_result = transcribe_audio_file(temp_file_path)

            # Store in database
            transcription_id = store_transcription_in_db(
                audio_url, 
                transcription_result, 
                user_id
            )

            # Return result
            response_data = {
                'transcription_id': transcription_id,
                'transcription': transcription_result['text'],
                'language': transcription_result['language'],
                'duration': transcription_result.get('duration', 0),
                'segments_count': len(transcription_result.get('segments', [])),
                'status': 'success'
            }

            logger.info(f"Transcription completed successfully: {transcription_id}")
            return jsonify(response_data), 200

        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                logger.info(f"Cleaned up temporary file: {temp_file_path}")

    except ValueError as e:
        logger.error(f"Validation error: {e}")
        return jsonify({'error': str(e), 'status': 'failed'}), 400
    except requests.exceptions.RequestException as e:
        logger.error(f"Download error: {e}")
        return jsonify({'error': 'Failed to download audio file', 'status': 'failed'}), 400
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        return jsonify({'error': str(e), 'status': 'failed'}), 500

@app.route('/transcription/<transcription_id>', methods=['GET'])
def get_transcription(transcription_id):
    """Get transcription by ID"""
    try:
        if not transcriptions_collection:
            return jsonify({'error': 'Database not connected'}), 500

        transcription = transcriptions_collection.find_one({'_id': transcription_id})

        if not transcription:
            return jsonify({'error': 'Transcription not found'}), 404

        # Convert MongoDB document to JSON-serializable format
        result = {
            'transcription_id': transcription['_id'],
            'audio_url': transcription['audio_url'],
            'transcription': transcription['transcription'],
            'language': transcription['language'],
            'duration': transcription.get('duration', 0),
            'created_at': transcription['created_at'].isoformat(),
            'status': transcription.get('status', 'completed')
        }

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error fetching transcription: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/transcriptions', methods=['GET'])
def list_transcriptions():
    """List all transcriptions for a user"""
    try:
        if not transcriptions_collection:
            return jsonify({'error': 'Database not connected'}), 500

        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))

        query = {}
        if user_id:
            query['user_id'] = user_id

        transcriptions = transcriptions_collection.find(query).sort('created_at', -1).skip(offset).limit(limit)

        results = []
        for t in transcriptions:
            results.append({
                'transcription_id': t['_id'],
                'audio_url': t['audio_url'],
                'transcription': t['transcription'][:200] + ('...' if len(t['transcription']) > 200 else ''),
                'language': t['language'],
                'duration': t.get('duration', 0),
                'created_at': t['created_at'].isoformat(),
                'status': t.get('status', 'completed')
            })

        return jsonify({
            'transcriptions': results,
            'count': len(results),
            'offset': offset,
            'limit': limit
        }), 200

    except Exception as e:
        logger.error(f"Error listing transcriptions: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'

    logger.info(f"Starting Flask transcription service on port {port}")
    logger.info(f"Whisper model: {WHISPER_MODEL}")
    logger.info(f"MongoDB URI: {MONGODB_URI}")

    app.run(host='0.0.0.0', port=port, debug=debug)
