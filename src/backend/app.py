from flask import Flask, jsonify, request
from flask_cors import CORS
from automata.dfa import DFASimulator

app = Flask(__name__)
CORS(app)

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({"status": "success", "message": "Backend Flask Automata siap!"})

# --- ENDPOINT MODUL 1: DFA ---
@app.route('/api/automata/dfa', methods=['POST'])
def simulate_dfa():
    try:
        data = request.get_json()
        
        # Mengambil data dari request frontend
        states = data.get('states', [])
        alphabet = data.get('alphabet', [])
        transitions = data.get('transitions', {})
        start_state = data.get('start_state', '')
        accept_states = data.get('accept_states', [])
        input_string = data.get('input_string', '')

        # Inisialisasi simulator DFA
        dfa = DFASimulator(states, alphabet, transitions, start_state, accept_states)
        
        # Jalankan simulasi
        result = dfa.process(input_string)
        
        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)