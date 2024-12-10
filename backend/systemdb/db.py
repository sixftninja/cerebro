# /Users/anand/Desktop/cerebro/backend/systemdb/db.py
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'system.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Users table (already exists)
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        code TEXT,
        role TEXT NOT NULL
    );
    ''')

    # Roles table
    c.execute('''
    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_name TEXT NOT NULL UNIQUE
    );
    ''')

    # Role permissions: Each row => role, datasource, access_type (R or W)
    c.execute('''
    CREATE TABLE IF NOT EXISTS role_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_name TEXT NOT NULL,
        datasource TEXT NOT NULL,
        access_type TEXT NOT NULL CHECK(access_type IN ('R','W'))
    );
    ''')

    # Ensure default roles exist
    default_roles = ['Admin', 'Developer', 'Analyst']
    for dr in default_roles:
        c.execute("SELECT * FROM roles WHERE role_name = ?", (dr,))
        if not c.fetchone():
            c.execute("INSERT INTO roles (role_name) VALUES (?)", (dr,))
    conn.commit()

    # Ensure John Smith is in users table
    c.execute("SELECT * FROM users WHERE email = ?", ('johnsmith@cerebro.com',))
    if not c.fetchone():
        c.execute("INSERT INTO users (name, email, code, role) VALUES (?, ?, ?, ?)",
                  ('John Smith', 'johnsmith@cerebro.com', '12345', 'Admin'))
        conn.commit()

    conn.close()

def get_user(email):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = c.fetchone()
    conn.close()
    return row

def update_user_code(email, code):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE users SET code = ? WHERE email = ?", (code, email))
    conn.commit()
    conn.close()

def get_all_users():
    # Return users with a permissions summary
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, name, email, role FROM users")
    users = c.fetchall()

    user_list = []
    for u in users:
        user_id, name, email, role = u
        perms = get_role_permissions_summary(role)
        user_list.append({
            'id': user_id,
            'name': name,
            'email': email,
            'role': role,
            'permissions': perms
        })

    conn.close()
    return user_list

def get_all_roles():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, role_name FROM roles")
    roles = c.fetchall()
    role_list = []
    for r in roles:
        rid, rname = r
        p = get_full_role_permissions(rname)
        role_list.append({
            'id': rid,
            'role_name': rname,
            'permissions': p
        })
    conn.close()
    return role_list

def get_full_role_permissions(role_name):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT datasource, access_type FROM role_permissions WHERE role_name = ?", (role_name,))
    rows = c.fetchall()
    perms = {}
    for ds, at in rows:
        perms[ds] = at
    conn.close()
    return perms

def get_role_permissions_summary(role_name):
    # Summarize permissions for display in table
    # For brevity, show a limited number and a shorthand: "SQL Server(W), GDrive(R), ..."
    perms = get_full_role_permissions(role_name)
    if not perms:
        return "No Permissions"
    summary_parts = []
    count = 0
    for ds, at in perms.items():
        abbr = at == 'W' and "(W)" or "(R)"
        summary_parts.append(f"{ds} {abbr}")
        count += 1
        if count == 3:
            # If too many, truncate
            if len(perms) > 3:
                summary_parts.append("...")
            break
    return ", ".join(summary_parts)

def add_user(name, email, role):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # code can be NULL here since it's just an invite
    c.execute("INSERT INTO users (name, email, code, role) VALUES (?, ?, ?, ?)",
              (name if name else 'No Name', email, None, role))
    conn.commit()
    conn.close()

def add_role(role_name, permissions):
    # permissions is a dict {datasource: 'R' or 'W'}
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Insert role if not exists
    c.execute("SELECT * FROM roles WHERE role_name=?", (role_name,))
    if c.fetchone():
        # role already exists, skip
        conn.close()
        return
    c.execute("INSERT INTO roles (role_name) VALUES (?)", (role_name,))
    for ds, at in permissions.items():
        c.execute("INSERT INTO role_permissions (role_name, datasource, access_type) VALUES (?,?,?)",
                  (role_name, ds, at))
    conn.commit()
    conn.close()