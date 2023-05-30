import re
from datetime import datetime
from flask import Flask,request  ##Imports Flask and request function to display HTML. 
import requests
from flask import render_template
import os

app = Flask(__name__, static_folder='static')

import pyodbc                 #Imports pydobc to connect Flask to Microsoft Server. 
def connection():
    server = 'ericsqlserver.database.windows.net' ##Credentials to connect to Microsoft Server. 
    database = 'ericsqldb'
    username = 'devuser0'
    password = 'Python2023'
    conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};' ##OBDC Driver to connect to SQL server, ODBC Driver may depend on other systems. 
                      'SERVER=ericsqlserver.database.windows.net;'
                      'DATABASE=ericsqldb;UID=devuser0;PWD=Python2023;')
    return conn

##import pypyodbc
##def connection():
  ##  myConString = os.environ['CUSTOMCONNSTR_DBConStr']
   ## conn = pypyodbc.connect(myConString)
    ##return conn

@app.route("/")         ##Sets the home page route to "searchiframe_hidejs.html", when visiting the website. 
def home():
    return render_template("searchiframe_hidejs.html") ##"searchiframe_hidejs.html" hosts the iframe. 

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
    storageAccount="testwebdbphotos" #Parametrizing image URL Direcotry
    containerName="pics" #Parameterizing image folder Directory
    table="ITSTAFF" ##Table variable to parameterize table selection or declaration.
    orderBy=f"order by Name ASC"
    

## Modify the code to implement security measures against SQL injections. via Parametrization
    placeholders = [] ## placeholder are used to search queries. 
    conditions = [] ## holds the amount of conditions. 
    
    if query in "310-243" or len(query) < 2  :   ##If the query length is less than 2, or when the phone number does not return further substrings, it will return nothing. 
        #mySQL=f"SELECT * from dbo.{table}" 
        mySQL=f"SELECT * FROM dbo.{table} WHERE 1=2" 
    elif search_by=="AllFields":   ##Else, if the query length > 3 and All Fields are searched, it will list multiple conditions it can be searched by. 
        conditions = [              ##name, firstname, lastname, phone, office, emailaddress, department, division, title. 
        "name LIKE ?",
        "firstname LIKE ?",
        "lastname LIKE ?",
        "phone LIKE ?",
        "office LIKE ?",
        "(LEFT(emailaddress, CHARINDEX('@', emailaddress) - 1) LIKE ?)", ##Checks to the left of the email address, to check for valid usernames, instead of allowing .edu.
        "emailaddress LIKE ?", ##Allows to check emails if there is a viable email entered by the user. 
        "Departement LIKE ?",
        "division LIKE ?",
        "title LIKE ?"
        ]
        placeholders = ['%' + query + '%'] * (len(conditions)-1) ##Placeholders in conjunction with conditions .
                                                             ## Will query the amount of times, equal to the length of conditions, 
                                                             ## Name LIKE %Bill%, firstname LIKE %BILL%, lastname LIKE %BILL%...
        placeholders.append(query)   
          
    elif search_by == "emailaddress ": ##Check to see if the user searches by email address.
        conditions.append("LEFT(emailaddress, CHARINDEX('@', emailaddress) - 1) LIKE ? OR emailaddress = ?") ##Checks to the left of the email address, to check for valid usernames, instead of allowing .edu.
                                                                ## OR It checks of the emailaddress is the exact string. 
        placeholders.append('%' + query + '%') ##Adds to the query in addition with contacentation, allows for partial searching of emails.
        placeholders.append(query) ##To search for exact email queries. 
        
    else:
       conditions.append(f"{search_by} LIKE ?") ##On the other hand, if its not search by All Fields, it will be based on "search_by" 
       placeholders.append('%' + query + '%') ##The query will then be appended,  search by = Name, therefore f"{Name} Like ? '%' + Bill + '%'
       
    if conditions:
        where_clause = " OR ".join(conditions) ##If there are existing conditions, then an "OR" operator will be joined along the conditions    
                                               ## Name LIKE %Bill% OR  firstname LIKE %BILL% OR lastname LIKE %BILL%.
                                               
        mySQL = f"SELECT * FROM dbo.{table} WHERE {where_clause}" ##mySQL combines where_clause with table
                                                                  ## THIS CREATES A PARAMETERIZED query, instead of directly pure query. 
        
    mySQL+= " " + orderBy      ##Concatenated with orderBy, will exucute search with conditions and orderBy string, in this case, ordered by ASCENDING order. 
    cursor.execute(mySQL, placeholders) ##Example: "SELECT * FROM dbo.Persons WHERE Name like %Bill% or FirstName %Bill% order by Name ASC"
    results = cursor.fetchall() ##variable "results" fetches all results from the search query, and puts them in the template.
    
    ##Returns results, storageAccount and containerName are both parameters of the blob storage. 
    return render_template('search_results_hidejs.html', results=results,storageAccount=storageAccount,containerName=containerName) 

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