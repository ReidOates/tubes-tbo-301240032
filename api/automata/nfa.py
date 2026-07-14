class NFASimulator:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = set(states)
        self.alphabet = set(alphabet)
        self.transitions = transitions  # Format NFA: {"q0": {"0": ["q0", "q1"], "e": ["q2"]}}
        self.start_state = start_state
        self.accept_states = set(accept_states)

    def get_epsilon_closure(self, current_states):
        """Mencari semua state yang bisa dicapai melalui transisi epsilon ('e')"""
        closure = set(current_states)
        stack = list(current_states)
        
        while stack:
            state = stack.pop()
            # Jika ada transisi epsilon dari state ini
            if state in self.transitions and 'e' in self.transitions[state]:
                for next_state in self.transitions[state]['e']:
                    if next_state not in closure:
                        closure.add(next_state)
                        stack.append(next_state)
        return closure

    def process(self, input_string):
        # Mulai dari start state + semua state yang bisa dicapai dengan epsilon
        current_states = self.get_epsilon_closure({self.start_state})
        trace = [{"input": "", "states": list(current_states)}]

        for symbol in input_string:
            if symbol not in self.alphabet:
                return {"status": "rejected", "reason": f"Simbol '{symbol}' tidak valid", "trace": trace}
            
            next_states = set()
            for state in current_states:
                if state in self.transitions and symbol in self.transitions[state]:
                    # Gabungkan semua state tujuan (karena NFA berupa list)
                    for n_state in self.transitions[state][symbol]:
                        next_states.add(n_state)
            
            # Hitung epsilon closure dari state tujuan yang baru
            current_states = self.get_epsilon_closure(next_states)
            trace.append({"input": symbol, "states": list(current_states)})
            
            if not current_states:
                return {"status": "rejected", "reason": f"Dead state pada simbol '{symbol}'", "trace": trace}

        is_accepted = any(state in self.accept_states for state in current_states)
        return {
            "status": "accepted" if is_accepted else "rejected",
            "reason": "Ada cabang komputasi yang mencapai Final State" if is_accepted else "Tidak ada cabang yang mencapai Final State",
            "trace": trace
        }