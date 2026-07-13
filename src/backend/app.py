from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Mengizinkan frontend mengakses API ini

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({
        "status": "success",
        "message": "Backend Flask Automata siap digunakan!"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)