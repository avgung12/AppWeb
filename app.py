import re
from datetime import datetime
from flask import Flask,request
import requests
from flask import render_template
import os

app = Flask(__name__)

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

#import pypyodbc
#def connection():
#    myConString = os.environ['CUSTOMCONNSTR_DBConStr']
#    conn = pypyodbc.connect(myConString)
#    return conn

@app.route("/")
def home():
    return render_template("searchiframe.html")

@app.route('/search_results', methods=['GET', 'POST'])
def search_results():
    query = str(request.form.get('query')).strip()
    search_by = request.form.get('search_by')
    if search_by is None:
        search_by="AllFields"
        query=""
    conn = connection()
    cursor = conn.cursor()

    table="ITSTAFF"
    orderBy=f"order by Name ASC"
    if query == "*" or len(query) < 2 :
        #mySQL=f"SELECT * from dbo.{table}" 
        mySQL=F"SELECT * from dbo.{table} where 1=2"
    elif search_by=="AllFields":
        mySQL=f"SELECT * from dbo.{table} where name like \'%{query}%\' or firstname like \'%{query}%\' or lastname like \'%{query}%\' or phone like \'%{query}%\' or office like \'%{query}%\' or emailaddress like \'%{query}%\' or Departement like \'%{query}%\' or division like \'%{query}%\' or title like \'%{query}%\'"
        #mySQL=f"SELECT * from dbo.{table} where name = '{query}\' or firstname = \'{query}\' or lastname = \'{query}\' or phone = \'{query}\' or office = \'{query}\' or emailaddress = \'{query}\' or Departement = \'{query}\' or division = \'{query}\' or title = \'{query}\'"
    else:
        mySQL=f"SELECT * from dbo.{table} where {search_by} like \'%{query}%'"
    mySQL=mySQL+orderBy
    cursor.execute(mySQL)
    results = cursor.fetchall()
    return render_template('search_results_test.html', results=results)

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