class CNFConverter:
    def __init__(self, rules):
        self.rules = rules # {"S": ["0S0", "1S1", "e"]}

    def remove_epsilon(self):
        # 1. Identifikasi nullable variables
        # 2. Update rules
        return "Logika eliminasi epsilon"

    def remove_unit_productions(self):
        # 3. Hapus A -> B
        return "Logika eliminasi unit"

    def transform_to_cnf(self):
        # 4. Final step: A -> BC dan A -> a
        return "Logika transformasi final"