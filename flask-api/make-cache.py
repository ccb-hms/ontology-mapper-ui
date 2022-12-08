import text2term as t2t

def main():
	onto_file = "ontologies.csv"
	t2t.cache_ontology_set(onto_file)

if __name__ == '__main__':
	main()