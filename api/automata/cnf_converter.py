import traceback

class CNFConverter:
    def __init__(self, rules, start_symbol):
        # Memastikan rules berbentuk dictionary yang aman
        self.rules = rules if isinstance(rules, dict) else {}
        self.start_symbol = start_symbol

    def convert(self):
        try:
            # 1. Grammar Awal (Aman dari tipe data string)
            original = {}
            for k, v in self.rules.items():
                if isinstance(v, list):
                    original[k] = list(v)
                elif isinstance(v, str):
                    original[k] = [v]
                else:
                    original[k] = []
            
            # 2. Eliminasi Epsilon
            no_epsilon = {}
            for k, v in original.items():
                new_prods = [p for p in v if p != 'e']
                no_epsilon[k] = new_prods if new_prods else ['e']

            # 3. Eliminasi Unit Production (A -> B)
            no_unit = {}
            for k, v in no_epsilon.items():
                new_prods = []
                for p in v:
                    if isinstance(p, str) and len(p) == 1 and p.isupper(): # Unit production
                        if p in no_epsilon:
                            new_prods.extend([x for x in no_epsilon[p] if x != p])
                    else:
                        new_prods.append(p)
                no_unit[k] = list(set(new_prods))

            # 4. Transformasi ke CNF
            cnf_final = {}
            var_counter = 1
            for k, v in no_unit.items():
                if k not in cnf_final:
                    cnf_final[k] = []
                for p in v:
                    if not isinstance(p, str):
                        continue
                    if len(p) == 1 and p.islower():
                        cnf_final[k].append(p)
                    elif len(p) == 2 and p.isupper():
                        cnf_final[k].append(p)
                    elif len(p) > 1:
                        # Pecah jadi dua: X -> YZ
                        current_var = k
                        panjang = len(p)
                        for i in range(panjang - 1):
                            simbol_kiri = p[i]
                            sisa = p[i+1:]
                            if len(sisa) == 1:
                                cnf_final[current_var].append(simbol_kiri + sisa)
                            else:
                                var_baru = f"X{var_counter}"
                                var_counter += 1
                                cnf_final[current_var].append(simbol_kiri + var_baru)
                                if var_baru not in cnf_final:
                                    cnf_final[var_baru] = []
                                current_var = var_baru
                    else:
                        cnf_final[k].append(p)

            return {
                "step1_original": original,
                "step2_no_epsilon": no_epsilon,
                "step3_no_unit": no_unit,
                "step4_cnf": cnf_final
            }
        except Exception as e:
            traceback.print_exc() # Cetak error di terminal backend agar mudah di-debug
            raise Exception(f"Terjadi kesalahan saat memproses aturan CNF: {str(e)}")