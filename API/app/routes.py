from flask import Blueprint, jsonify
from app import mysql 
import MySQLdb.cursors

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/data', methods=['GET'])
def get_all_data():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM tender_data ORDER BY id ASC")
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500