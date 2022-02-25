import os
import sys
import camelot
import pandas as pd
import ghostscript

pdfName = "./pdfs/" + str(sys.argv[1])

table = camelot.read_pdf(pdfName, flavor='lattice') 
table1 = table[0].df
new_header = table1.iloc[0] #grab the first row for the header
table1 = table1[1:] #take the data less the header row
table1.columns = new_header
table1.reset_index(drop=True)
data = table1.to_json(orient='records')
print(data)