document.addEventListener("DOMContentLoaded", () => {
    const projectList = document.getElementById("projectList");
    const projectForm = document.getElementById("projectForm");
    const clearAll = document.getElementById("clearAll");

    // Функция загрузки списка проектов
    function loadProjects() {
        fetch("/api/projects")
            .then(response => response.json())
            .then(projects => {
                projectList.innerHTML = "";
                projects
                
                .forEach(project => {
                    const li = document.createElement("li");
                    li.innerHTML = `${project.title} (${project.link}) 
                        <button onclick="deleteProject(${project.id})">Удалить</button>`;
                        projectList.appendChild(li);
                });
            });
    }

    // Добавление проекта
    projectForm.addEventListener("submit", event => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const link = document.getElementById("link").value;

        fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, link })
        }).then(response => response.json())
          .then(() => {
                projectForm.reset();
                loadProjects();
          });
    });

    // Удаление проекта
    window.deleteProject = (id) => {
        fetch(`/api/projects/${id}`, { method: "DELETE" })
            .then(() => loadProjects());
    };

    // Удаление всех проектов
    clearAll.addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите удалить все проекты?")) {
            fetch("/api/projects/clear", { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    loadProjects();
                }
            });
        }
    });

    // Загрузка проектов при загрузке страницы
    loadProjects();
});
document.addEventListener("DOMContentLoaded", () => {
    const projectList = document.getElementById("projectList");
    const projectForm = document.getElementById("projectForm");

    // Функция загрузки списка проектов
    function loadProjects() {
        fetch("/api/projects")
            .then(response => response.json())
            .then(projects => {
                projectList.innerHTML = "";
                projects.forEach(project => {
                    const li = document.createElement("li");
                    li.innerHTML = `${project.title} (${project.link}) 
                        <button onclick="deleteProject(${project.id})">Удалить</button>`;
                    projectList.appendChild(li);
                });
            });
    }

    // Добавление проекта
    projectForm.addEventListener("submit", event => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const link = document.getElementById("link").value;

        fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, link })
        }).then(response => response.json())
          .then(() => {
            projectForm.reset();
              loadProjects();
          });
    });

    // Удаление проекта
    window.deleteProject = (id) => {
        fetch(`/api/projects/${id}`, { method: "DELETE" })
            .then(() => loadProjects());
    };

    // Загрузка проектов при загрузке страницы
    loadProjects();
});