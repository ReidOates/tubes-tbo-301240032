class MooreMachine:
    def __init__(self, states, alphabet, transitions, output_table, start_state):
        self.transitions = transitions
        self.output_table = output_table # Format: {"q0": "0", "q1": "1"}
        self.start_state = start_state

    def process(self, input_string):
        current_state = self.start_state
        # Moore memancarkan output bahkan sebelum membaca input (saat di start state)
        trace = [current_state]
        output_str = self.output_table.get(current_state, "")

        for symbol in input_string:
            if current_state in self.transitions and symbol in self.transitions[current_state]:
                current_state = self.transitions[current_state][symbol]
                trace.append(current_state)
                output_str += self.output_table.get(current_state, "")
            else:
                return {"status": "error", "reason": f"Transisi putus di {current_state} simbol {symbol}"}
                
        return {"status": "success", "output": output_str, "trace": trace}


class MealyMachine:
    def __init__(self, states, alphabet, transitions, start_state):
        # Format Mealy transitions: {"q0": {"a": {"next": "q1", "output": "0"}}}
        self.transitions = transitions
        self.start_state = start_state

    def process(self, input_string):
        current_state = self.start_state
        trace = [current_state]
        output_str = ""

        for symbol in input_string:
            if current_state in self.transitions and symbol in self.transitions[current_state]:
                trans = self.transitions[current_state][symbol]
                current_state = trans["next"]
                output_str += trans["output"]
                trace.append(current_state)
            else:
                return {"status": "error", "reason": f"Transisi putus di {current_state} simbol {symbol}"}
                
        return {"status": "success", "output": output_str, "trace": trace}