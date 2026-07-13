class DFASimulator:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = set(states)               # Q: Himpunan state
        self.alphabet = set(alphabet)           # Σ: Alfabet input
        self.transitions = transitions          # δ: Fungsi transisi (dictionary)
        self.start_state = start_state          # q0: State awal
        self.accept_states = set(accept_states) # F: Himpunan state akhir

    def process(self, input_string):
        current_state = self.start_state
        trace = [current_state] # Untuk melacak jejak transisi state

        for symbol in input_string:
            # Validasi input
            if symbol not in self.alphabet:
                return {
                    "status": "rejected", 
                    "reason": f"Simbol '{symbol}' tidak dikenali dalam alfabet", 
                    "trace": trace
                }
            
            # Eksekusi perpindahan state
            if current_state in self.transitions and symbol in self.transitions[current_state]:
                current_state = self.transitions[current_state][symbol]
                trace.append(current_state)
            else:
                return {
                    "status": "rejected", 
                    "reason": f"Transisi terputus di {current_state} pada simbol '{symbol}'", 
                    "trace": trace
                }

        # Cek status akhir
        is_accepted = current_state in self.accept_states
        return {
            "status": "accepted" if is_accepted else "rejected",
            "reason": "String valid (Berakhir di Final State)" if is_accepted else "String invalid (Berakhir di Non-Final State)",
            "trace": trace
        }