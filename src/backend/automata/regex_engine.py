class RegexToNFA:
    def __init__(self):
        self.state_counter = 0

    def new_state(self):
        """Membuat nama state baru secara dinamis (q0, q1, dst)"""
        state = f"q{self.state_counter}"
        self.state_counter += 1
        return state

    def format_regex(self, regex):
        """Menyisipkan operator concatenation (.) secara eksplisit.
        Contoh: ab -> a.b, a(b|c) -> a.(b|c)"""
        res = ""
        all_operators = ['|', '?', '+', '*', '^']
        binary_operators = ['^', '|']
        for i in range(len(regex)):
            c1 = regex[i]
            if i + 1 < len(regex):
                c2 = regex[i + 1]
                res += c1
                if c1 != '(' and c2 != ')' and c1 not in binary_operators and c2 not in all_operators:
                    res += '.'
            else:
                res += c1
        return res

    def infix_to_postfix(self, regex):
        """Mengubah infix regex menjadi postfix menggunakan Shunting-yard algorithm"""
        precedence = {'*': 3, '.': 2, '|': 1}
        stack = []
        postfix = ""
        for char in regex:
            if char.isalnum(): # Jika operand (a, b, 0, 1)
                postfix += char
            elif char == '(':
                stack.append(char)
            elif char == ')':
                while stack and stack[-1] != '(':
                    postfix += stack.pop()
                stack.pop() # Buang '('
            else:
                while stack and stack[-1] != '(' and precedence.get(stack[-1], 0) >= precedence.get(char, 0):
                    postfix += stack.pop()
                stack.append(char)
        while stack:
            postfix += stack.pop()
        return postfix

    def convert_to_nfa(self, regex):
        """Membangun NFA 5-Tuple menggunakan Thompson's Construction"""
        formatted_regex = self.format_regex(regex)
        postfix = self.infix_to_postfix(formatted_regex)
        
        stack = []
        transitions = {}
        alphabet = set()

        for char in postfix:
            if char.isalnum():
                # NFA Dasar untuk satu simbol
                start = self.new_state()
                accept = self.new_state()
                transitions[start] = {char: [accept]}
                transitions[accept] = {}
                stack.append((start, accept))
                alphabet.add(char)
                
            elif char == '.':
                # Concatenation
                nfa2_start, nfa2_accept = stack.pop()
                nfa1_start, nfa1_accept = stack.pop()
                # Hubungkan accept nfa1 ke start nfa2 dengan epsilon ('e')
                if 'e' not in transitions[nfa1_accept]:
                    transitions[nfa1_accept]['e'] = []
                transitions[nfa1_accept]['e'].append(nfa2_start)
                stack.append((nfa1_start, nfa2_accept))
                
            elif char == '|':
                # Union (OR)
                nfa2_start, nfa2_accept = stack.pop()
                nfa1_start, nfa1_accept = stack.pop()
                start = self.new_state()
                accept = self.new_state()
                
                transitions[start] = {'e': [nfa1_start, nfa2_start]}
                
                if 'e' not in transitions[nfa1_accept]: transitions[nfa1_accept]['e'] = []
                if 'e' not in transitions[nfa2_accept]: transitions[nfa2_accept]['e'] = []
                
                transitions[nfa1_accept]['e'].append(accept)
                transitions[nfa2_accept]['e'].append(accept)
                transitions[accept] = {}
                
                stack.append((start, accept))
                
            elif char == '*':
                # Kleene Star
                nfa_start, nfa_accept = stack.pop()
                start = self.new_state()
                accept = self.new_state()
                
                transitions[start] = {'e': [nfa_start, accept]}
                
                if 'e' not in transitions[nfa_accept]: transitions[nfa_accept]['e'] = []
                transitions[nfa_accept]['e'].extend([nfa_start, accept])
                transitions[accept] = {}
                
                stack.append((start, accept))

        final_start, final_accept = stack.pop()
        states = list(transitions.keys())

        return {
            "states": states,
            "alphabet": list(alphabet),
            "start_state": final_start,
            "accept_states": [final_accept],
            "transitions": transitions
        }