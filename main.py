from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///projects.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# Модель портфолио
class Projects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    link = db.Column(db.String(300), unique=True, nullable=False)

    def to_dict(self):
        return {"id": self.id, "title": self.title, "link": self.link}


# Создание базы данных
with app.app_context():
    db.create_all()


# Главная страница (фронтенд)
@app.route("/")
def index():
    return render_template("index.html")


# Получение всех поектов из портфолио
@app.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Projects.query.all()
    return jsonify([project.to_dict() for project in projects])


# Добавление проекта
@app.route("/api/projects", methods=["POST"])
def add_project():
    data = request.get_json()
    existing = Projects.query.filter_by(link=data['link']).first()
    if existing:
        return jsonify({'error': 'Проект с такой ссылкой уже существует'}), 400
    new_project = Projects(title=data["title"], link=data["link"])
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201


# Удаление проекта
@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    project = Projects.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted successfully"})

# Удаление портфолио
@app.route("/api/projects/clear", methods=["DELETE"])
def clear_projects():
    try:
        num_deleted = db.session.query(Projects).delete()
        db.session.commit()
        return jsonify({"message": f"Удалено {num_deleted} проектов"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

