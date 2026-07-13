class CFGEngine:
    def __init__(self, rules, start_symbol):
        # Format rules: {"S": ["aSb", "e"]}
        self.rules = rules
        self.start_symbol = start_symbol
        self.max_depth = 20 # Mencegah infinite loop jika CFG rekursif kiri

    def parse(self, target_string):
        """Mencari Leftmost Derivation menggunakan DFS Backtracking"""
        # Node awal pohon: ID, Label, Parent ID
        initial_tree = [{"id": "node_0", "label": self.start_symbol, "parent": None}]
        
        # Format antrian: (current_string_list, current_derivation_text, tree_nodes, current_node_counter)
        stack = [([self.start_symbol], [self.start_symbol], initial_tree, 1)]

        while stack:
            current_symbols, derivation_path, tree_nodes, node_counter = stack.pop()

            # Gabungkan list simbol menjadi string untuk dicek
            # Anggap 'e' adalah epsilon (string kosong)
            current_str = "".join([s for s in current_symbols if s != 'e'])

            # Jika sudah tidak ada Non-Terminal
            if not any(s in self.rules for s in current_symbols):
                if current_str == target_string:
                    return {
                        "status": "accepted",
                        "derivation": derivation_path,
                        "tree": tree_nodes
                    }
                continue # Coba cabang lain

            # Cek panjang string untuk pruning (optimasi agar tidak infinite loop)
            # Jika target_string "ab" dan current_str sudah "aba", batalkan cabang ini
            if len([s for s in current_symbols if s not in self.rules and s != 'e']) > len(target_string):
                continue

            # Cari Non-Terminal pertama dari kiri (Leftmost Derivation)
            leftmost_idx = -1
            for i, sym in enumerate(current_symbols):
                if sym in self.rules:
                    leftmost_idx = i
                    break

            if leftmost_idx != -1:
                non_terminal = current_symbols[leftmost_idx]
                # Cari ID dari node tree yang sedang diekspansi ini
                # Kita asumsikan node non-terminal yang belum punya anak di posisi ini
                parent_node = [n for n in tree_nodes if n["label"] == non_terminal and not any(c.get("parent") == n["id"] for c in tree_nodes)][0]

                # Coba semua aturan produksi dari Non-Terminal tersebut
                # Dibalik (reversed) agar pop() dari stack mengeksekusi aturan pertama lebih dulu
                for production in reversed(self.rules[non_terminal]):
                    new_symbols = current_symbols[:leftmost_idx] + list(production) + current_symbols[leftmost_idx+1:]
                    
                    # Buat string derivasi baru untuk ditampilkan
                    new_derivation_str = "".join(new_symbols)
                    new_derivation_path = derivation_path + [new_derivation_str]

                    # Buat salinan tree dan tambahkan anak-anak baru
                    new_tree = list(tree_nodes)
                    new_counter = node_counter
                    
                    for char in production:
                        new_tree.append({
                            "id": f"node_{new_counter}",
                            "label": char,
                            "parent": parent_node["id"]
                        })
                        new_counter += 1

                    stack.append((new_symbols, new_derivation_path, new_tree, new_counter))

        return {
            "status": "rejected",
            "reason": f"String '{target_string}' tidak dapat diturunkan dari Grammar ini.",
            "derivation": [],
            "tree": []
        }