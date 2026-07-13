from automata.regex_engine import RegexToNFA
from flask import Flask, jsonify, request
from flask_cors import CORS
from automata.dfa import DFASimulator
from automata.nfa import NFASimulator
from automata.cfg_engine import CFGEngine
from automata.nfa_to_dfa import NFAToDFAConverter
from automata.moore_mealy import MooreMachine, MealyMachine
from automata.cnf_converter import CNFConverter

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

# --- ENDPOINT MODUL 1: NFA ---
@app.route('/api/automata/nfa', methods=['POST'])
def simulate_nfa():
    try:
        data = request.get_json()
        nfa = NFASimulator(
            data.get('states', []),
            data.get('alphabet', []),
            data.get('transitions', {}),
            data.get('start_state', ''),
            data.get('accept_states', [])
        )
        result = nfa.process(data.get('input_string', ''))
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# --- ENDPOINT KONVERSI NFA KE DFA ---
@app.route('/api/automata/nfa-to-dfa', methods=['POST'])
def convert_nfa_to_dfa():
    try:
        data = request.get_json()
        converter = NFAToDFAConverter(
            data.get('states', []),
            data.get('alphabet', []),
            data.get('transitions', {}),
            data.get('start_state', ''),
            data.get('accept_states', [])
        )
        result = converter.convert()
        return jsonify({"success": True, "data": {"dfa": result}}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# --- ENDPOINT MOORE MACHINE ---
@app.route('/api/automata/moore', methods=['POST'])
def simulate_moore():
    try:
        data = request.get_json()
        machine = MooreMachine(
            data.get('states', []),
            data.get('alphabet', []),
            data.get('transitions', {}),
            data.get('output_table', {}),
            data.get('start_state', '')
        )
        result = machine.process(data.get('input_string', ''))
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# --- ENDPOINT MEALY MACHINE ---
@app.route('/api/automata/mealy', methods=['POST'])
def simulate_mealy():
    try:
        data = request.get_json()
        machine = MealyMachine(
            data.get('states', []),
            data.get('alphabet', []),
            data.get('transitions', {}),
            data.get('start_state', '')
        )
        result = machine.process(data.get('input_string', ''))
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# --- FONDASI MODUL 2: REGULAR EXPRESSION ---
@app.route('/api/regex/convert', methods=['POST'])
def convert_regex():
    try:
        data = request.get_json()
        regex_pattern = data.get('regex', '')
        
        if not regex_pattern:
            return jsonify({"success": False, "error": "Regex tidak boleh kosong"}), 400

        # Inisialisasi engine dan lakukan konversi
        engine = RegexToNFA()
        nfa_result = engine.convert_to_nfa(regex_pattern)
        
        # (Nanti kita tambahkan konversi ke Aturan Produksi (Grammar) di sini untuk melengkapi fitur wajib)
        
        return jsonify({
            "success": True,
            "data": {
                "nfa": nfa_result
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Gagal memproses Regex: {str(e)}"
        }), 400

# --- ENDPOINT MODUL 3: CFG & PUSHDOWN AUTOMATA ---
@app.route('/api/cfg/parse', methods=['POST'])
def parse_cfg():
    try:
        data = request.get_json()
        rules = data.get('rules', {})
        start_symbol = data.get('start_symbol', 'S')
        target_string = data.get('target_string', '')

        if not rules:
            return jsonify({"success": False, "error": "Aturan produksi CFG tidak boleh kosong"}), 400

        engine = CFGEngine(rules, start_symbol)
        result = engine.parse(target_string)
        
        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Terjadi kesalahan saat memproses CFG: {str(e)}"
        }), 400
    
    # --- ENDPOINT MODUL 4: CNF ---
@app.route('/api/cnf/convert', methods=['POST'])
def convert_cnf():
    try:
        data = request.get_json()
        converter = CNFConverter(data.get('rules', {}), data.get('start_symbol', 'S'))
        result = converter.convert()
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)