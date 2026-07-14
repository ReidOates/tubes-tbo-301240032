class NFAToDFAConverter:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.alphabet = [a for a in alphabet if a != 'e'] # Epsilon bukan alfabet input
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = set(accept_states)

    def get_epsilon_closure(self, states):
        closure = set(states)
        stack = list(states)
        while stack:
            state = stack.pop()
            if state in self.transitions and 'e' in self.transitions[state]:
                for next_state in self.transitions[state]['e']:
                    if next_state not in closure:
                        closure.add(next_state)
                        stack.append(next_state)
        return closure

    def convert(self):
        # 1. State awal DFA adalah Epsilon Closure dari state awal NFA
        dfa_start = frozenset(self.get_epsilon_closure({self.start_state}))
        
        dfa_states = [dfa_start]
        unmarked_states = [dfa_start]
        dfa_transitions = {}
        dfa_accept_states = []

        # 2. Iterasi mencari state baru
        while unmarked_states:
            current_dfa_state = unmarked_states.pop(0)
            current_state_name = ",".join(sorted(list(current_dfa_state)))
            if not current_state_name: current_state_name = "DEAD"

            dfa_transitions[current_state_name] = {}

            # Cek apakah ini final state
            if any(s in self.accept_states for s in current_dfa_state):
                if current_state_name not in dfa_accept_states:
                    dfa_accept_states.append(current_state_name)

            for symbol in self.alphabet:
                # Cari transisi untuk setiap state di dalam subset
                next_nfa_states = set()
                for nfa_state in current_dfa_state:
                    if nfa_state in self.transitions and symbol in self.transitions[nfa_state]:
                        next_nfa_states.update(self.transitions[nfa_state][symbol])
                
                # Epsilon closure dari state tujuan
                next_dfa_state = frozenset(self.get_epsilon_closure(next_nfa_states))
                next_state_name = ",".join(sorted(list(next_dfa_state)))
                if not next_state_name: next_state_name = "DEAD"

                dfa_transitions[current_state_name][symbol] = next_state_name

                if next_dfa_state not in dfa_states and next_dfa_state:
                    dfa_states.append(next_dfa_state)
                    unmarked_states.append(next_dfa_state)

        return {
            "states": [",".join(sorted(list(s))) if s else "DEAD" for s in dfa_states],
            "alphabet": self.alphabet,
            "start_state": ",".join(sorted(list(dfa_start))),
            "accept_states": dfa_accept_states,
            "transitions": dfa_transitions
        }