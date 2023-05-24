import re
from datetime import datetime
from flask import Flask,request
import requests
from flask import render_template
import os

app = Flask(__name__, static_folder='static')

import pyodbc
def connection():
    server = 'ericsqlserver.database.windows.net'
    database = 'ericsqldb'
    username = 'devuser0'
    password = 'Python2023'
    conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                      'SERVER=ericsqlserver.database.windows.net;'
                      'DATABASE=ericsqldb;UID=devuser0;PWD=Python2023;')
    return conn

##import pypyodbc
##def connection():
  ##  myConString = os.environ['CUSTOMCONNSTR_DBConStr']
   ## conn = pypyodbc.connect(myConString)
    ##return conn

@app.route("/")
def home():
    return render_template("searchiframe_testcase_copy.html")

@app.route('/search_results', methods=['GET', 'POST'])
def search_results():
    query = str(request.form.get('query')).strip()
    search_by = request.form.get('search_by')
    if search_by is None:
        search_by="AllFields"
        query=""
    conn = connection()
    cursor = conn.cursor()

    #storageAccount=os.environ['env_storageAccount']
    #containerName=os.environ['env_containerName']
    #table=os.environ['env_myTable']
    storageAccount="testwebdbphotos"
    containerName="pics"
    table="ITSTAFF"
    orderBy=f"order by Name ASC"
    
    placeholders = []
    conditions = []
    
    if query == "*" or len(query) < 2 :
        #mySQL=f"SELECT * from dbo.{table}" 
        mySQL=f"SELECT * FROM dbo.{table} WHERE 1=2"
    elif search_by=="AllFields":
        conditions = [
        "name LIKE ?",
        "firstname LIKE ?",
        "lastname LIKE ?",
        "phone LIKE ?",
        "office LIKE ?",
        "emailaddress LIKE ?",
        "Departement LIKE ?",
        "division LIKE ?",
        "title LIKE ?"
        ]
        placeholders = ['%' + query + '%'] * len(conditions)
    else:
       conditions.append(f"{search_by} LIKE ?")
       placeholders.append('%' + query + '%')
       
    if conditions:
        where_clause = " OR ".join(conditions)
        mySQL = f"SELECT * FROM dbo.{table} WHERE {where_clause}"
        
    mySQL+= " " + orderBy
    cursor.execute(mySQL, placeholders)
    results = cursor.fetchall()
    return render_template('search_results_test_copy.html', results=results,storageAccount=storageAccount,containerName=containerName)

if __name__ == '__main__':
    app.run(debug=True)

#Deploy to Azure:
#1. Comment out: 'import pyodbc'. Add: import pypyodbc & import os
#2. pip freeze>requirements.txt(skip this step if already done)
#3. Create configuration in “Settings|Configuration”:
#   Name: DBConStr
#   Value:DRIVER={ODBC Driver 17 for SQL Server};SERVER=tcp:ericsqlserver.database.windows.net;PORT=1433;DATABASE=ericsqldb;Authentication=ActiveDirectoryMSI
#   Type: Custom
#4. Replace with new DB connect function:
#def connection():
#    myConString = os.environ['CUSTOMCONNSTR_DBConStr']
#    conn = pypyodbc.connect(myConString)
#    return conn   