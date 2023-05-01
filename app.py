import re
from datetime import datetime

from flask import Flask,request
from flask import render_template
import pyodbc

app = Flask(__name__)

def connection():
    server = 'ericsqlserver.database.windows.net'
    database = 'ericsqldb'
    username = 'devuser0'
    password = 'Python2023'
    conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                      'SERVER=ericsqlserver.database.windows.net;'
                      'DATABASE=ericsqldb;UID=devuser0;PWD=Python2023;')
    return conn

@app.route("/")
def home():
    return render_template("searchiframe.html")

#@app.route('/search_results', methods=['GET', 'POST'])
#def search_results():
#    query = request.form.get('query')
#    search_by = request.form.get('search_by')
#    results = ["result 1", "result 2", "result 3"]
#    return render_template('search_results.html', query=query, search_by=search_by,results=results)

@app.route('/search_results', methods=['GET', 'POST'])
def search_results():

    query = str(request.form.get('query')).strip()

    search_by = request.form.get('search_by')

    if search_by is None:

        search_by="AllFields"

        query=""

    conn = connection()

    cursor = conn.cursor()

    if query == "*" or len(query)==0:

        mySQL=f"SELECT * from dbo.Persons"  

    elif search_by=="AllFields":

        mySQL=f"SELECT * from dbo.Persons where firstname=\'{query}\' or lastname=\'{query}\' or phone=\'{query}\' or office=\'{query}\' or emailaddress=\'{query}\' or Departement=\'{query}\' or division=\'{query}\' or title=\'{query}\'"    

    else:

        mySQL=f"SELECT * from dbo.Persons where {search_by}=\'{query}\'"

    cursor.execute(mySQL)

    results = cursor.fetchall()

    return render_template('search_results.html', results=results,query=query,search_by=search_by)


@app.route("/hello/")
@app.route("/hello/<name>")
def hello_there(name = None):
    return render_template(
        "hello_there.html",
        name=name,
        date=datetime.now()
    )

@app.route("/api/data")
def get_data():
    return app.send_static_file("data.json")

# New functions
@app.route("/about/")
def about():
    return render_template("about.html")

@app.route("/contact/")
def contact():
    return render_template("contact.html")


if __name__ == '__main__':
    app.run(debug=True)