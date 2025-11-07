const input = document.querySelector("#input");
const btn_add = document.getElementById("add");
const btn_filter = document.getElementById("filter");
const task_cont = document.querySelector("container");
const inputBlock = document.querySelector(".input-block");
const list = document.getElementById("list");
const opt = document.getElementById("option");
const iptMod = document.querySelector(".input_modif");
const clr = document.querySelector(".couleur");
const horaire = document.querySelector(".horaire");
const taskDateInput = document.querySelector(".date");
const taskTimeInput = document.querySelector(".heure");
const taskCategorie = document.getElementById("categorie_select");

// Fonction pour appliquer la couleur à une tâche
function applyColorToTask(task, color) {
  if (!task || !color) return;
  
  // Appliquer la couleur à la bordure
  task.style.borderColor = color;
  
  // Appliquer l'accent-color à la checkbox
  const checkbox = task.querySelector("input[type='checkbox']");
  if (checkbox) {
    checkbox.style.accentColor = color;
  }
  
  // Appliquer la couleur au bouton trash
  const trashBtn = task.querySelector(".trash");
  if (trashBtn) {
    trashBtn.style.borderColor = color;
    trashBtn.style.backgroundColor = color;
  }
}

function addDeleteListener(trashBtn, taskElement) {
  trashBtn.addEventListener("click", () => {
    taskElement.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      taskElement.remove();
    }, 300);
  });
}

document.querySelectorAll(".trash").forEach((trashBtn) => {
  const taskElement = trashBtn.closest(".task");
  if (taskElement) {
    addDeleteListener(trashBtn, taskElement);
  }
});

// Fonction pour ajouter une nouvelle tâche
function addNewTask() {
  if (input.value.trim() === "") {
    input.classList.remove("wobble-error"); 
    void input.offsetWidth; 
    input.classList.add("wobble-error");
    
    
    setTimeout(() => {
      input.classList.remove("wobble-error");
    }, 600); 
  } else {
    const newTask = document.createElement("div");
    newTask.className = "task";
    
    const label = document.createElement("label");
    label.className = "form-control";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "checkbox";
    label.appendChild(checkbox);
    
    const span = document.createElement("span");
    span.textContent = input.value.trim();
    
    const trashBtn = document.createElement("button");
    trashBtn.className = "trash";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    trashBtn.appendChild(trashIcon);
    
    
    newTask.appendChild(label);
    newTask.appendChild(span);
    newTask.appendChild(trashBtn);
    
    // Appliquer la couleur par défaut
    applyColorToTask(newTask, "#a63a50");
    newTask.dataset.color = "#a63a50";
    
    // Ajouter la tâche à la liste
    list.appendChild(newTask);
    
    // Vider l'input
    input.value = "";
    
    // Ajouter l'événement de suppression au bouton trash
    addDeleteListener(trashBtn, newTask);
  }
}

btn_add.addEventListener("click", (e) => {
  addNewTask();
});

// Ajouter une tâche avec la touche Entrée dans l'input
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addNewTask();
  }
});

function openCheck(dialog) {
  if (dialog.open) {
    console.log("Dialog open");
  } else {
    console.log("Dialog closed");
  }
}

// Variable pour stocker la tâche actuellement en édition
let currentTask = null;

// Fonction pour charger les valeurs de la tâche dans la modal
function loadTaskValues(task) {
  if (!task) return;
  
  // Charger le texte
  const taskSpan = task.querySelector("span");
  if (taskSpan && iptMod) {
    iptMod.value = taskSpan.textContent;
  }
  
  // Charger la date et l'heure
  const dateTimeElement = task.querySelector(".task-datetime");
  if (dateTimeElement) {
    const dateValue = task.dataset.date || "";
    const timeValue = task.dataset.time || "";
    if (taskDateInput) taskDateInput.value = dateValue;
    if (taskTimeInput) taskTimeInput.value = timeValue;
  } else {
    if (taskDateInput) taskDateInput.value = "";
    if (taskTimeInput) taskTimeInput.value = "";
  }
  
  // Charger la couleur
  const taskColor = task.dataset.color || "#a63a50";
  if (clr) {
    clr.value = taskColor;
  }
  
  // Charger la catégorie
  const taskCategory = task.dataset.category || "";
  if (taskCategorie) {
    // Désélectionner toutes les options
    Array.from(taskCategorie.options).forEach(option => {
      option.selected = false;
    });
    // Sélectionner la catégorie sauvegardée
    if (taskCategory) {
      const option = Array.from(taskCategorie.options).find(opt => opt.value === taskCategory);
      if (option) option.selected = true;
    }
  }
}

list.addEventListener("click", (e) => {
  // Vérifier si le clic est sur une tâche (mais pas sur le bouton trash ou checkbox)
  const task = e.target.closest(".task");
  if (task && !e.target.closest(".trash") && !e.target.closest("input[type='checkbox']")) {
    // Stocker la référence à la tâche
    currentTask = task;
    
    // Charger toutes les valeurs de la tâche dans la modal
    loadTaskValues(task);
    
    opt.showModal();
    openCheck(opt);
  }
});

// Fonction pour réinitialiser les valeurs de la modal
function resetModalValues() {
  if (iptMod) iptMod.value = "";
  if (taskDateInput) taskDateInput.value = "";
  if (taskTimeInput) taskTimeInput.value = "";
  if (clr) clr.value = "#a63a50";
  if (taskCategorie) {
    Array.from(taskCategorie.options).forEach(option => {
      option.selected = false;
    });
  }
  currentTask = null;
}

// Fermer la modal avec le bouton Annuler
const btnAnnuler = document.querySelector(".annuler");
if (btnAnnuler) {
  btnAnnuler.addEventListener("click", () => {
    resetModalValues();
    opt.close();
  });
}

// Fonction pour sauvegarder les modifications de la tâche
function saveTaskChanges() {
  if (!currentTask) return;
  
  // 1. Modifier le texte de la tâche
  const taskSpan = currentTask.querySelector("span");
  if (taskSpan && iptMod) {
    taskSpan.textContent = iptMod.value.trim();
  }
  
  // 2. Gérer la date et l'heure
  const dateValue = taskDateInput ? taskDateInput.value : "";
  const timeValue = taskTimeInput ? taskTimeInput.value : "";
  
  // Supprimer l'ancien élément datetime s'il existe
  const oldDateTime = currentTask.querySelector(".task-datetime");
  if (oldDateTime) {
    oldDateTime.remove();
  }
  
  // Créer et ajouter le nouvel élément datetime si date ou heure est sélectionnée
  if (dateValue || timeValue) {
    const dateTimeElement = document.createElement("span");
    dateTimeElement.className = "task-datetime";
    
    let dateTimeText = "";
    if (dateValue && timeValue) {
      // Formater la date et l'heure
      const date = new Date(dateValue + "T" + timeValue);
      dateTimeText = date.toLocaleDateString("fr-FR", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      }) + " " + date.toLocaleTimeString("fr-FR", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } else if (dateValue) {
      const date = new Date(dateValue);
      dateTimeText = date.toLocaleDateString("fr-FR", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      });
    } else if (timeValue) {
      const time = timeValue.split(":");
      dateTimeText = time[0] + ":" + time[1];
    }
    
    dateTimeElement.textContent = dateTimeText;
    
    // Insérer entre le span et le bouton trash
    const trashBtn = currentTask.querySelector(".trash");
    if (trashBtn && taskSpan) {
      currentTask.insertBefore(dateTimeElement, trashBtn);
    }
    
    // Stocker dans les data-attributes
    currentTask.dataset.date = dateValue;
    currentTask.dataset.time = timeValue;
  } else {
    // Supprimer les data-attributes si pas de date/heure
    delete currentTask.dataset.date;
    delete currentTask.dataset.time;
  }
  
  // 3. Appliquer la couleur
  const selectedColor = clr ? clr.value : "#a63a50";
  applyColorToTask(currentTask, selectedColor);
  currentTask.dataset.color = selectedColor;
  
  // 4. Sauvegarder la catégorie
  if (taskCategorie) {
    const selectedCategory = Array.from(taskCategorie.selectedOptions)[0];
    if (selectedCategory && selectedCategory.value) {
      currentTask.dataset.category = selectedCategory.value;
    } else {
      delete currentTask.dataset.category;
    }
  }
  
  // Réinitialiser currentTask et fermer la modal
  currentTask = null;
  opt.close();
}

// Fermer la modal avec le bouton Sauvegarder
const btnSave = document.querySelector(".save");
if (btnSave) {
  btnSave.addEventListener("click", () => {
    saveTaskChanges();
  });
}

// Sauvegarder avec la touche Entrée dans la modal
opt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && opt.open) {
    // Sauvegarder avec Entrée (sauf si on est dans le select multiple où on peut utiliser Ctrl+Enter)
    const activeElement = document.activeElement;
    if (activeElement === taskCategorie && !e.ctrlKey) {
      // Dans le select multiple, on utilise Ctrl+Enter pour sauvegarder
      // Sinon, on laisse le comportement par défaut
      return;
    }
    e.preventDefault();
    saveTaskChanges();
  }
  
  // Annuler avec la touche Échap
  if (e.key === "Escape" && opt.open) {
    e.preventDefault();
    resetModalValues();
    opt.close();
  }
});

// Fermer la modal en cliquant en dehors (backdrop)
opt.addEventListener("click", (e) => {
  if (e.target === opt) {
    resetModalValues();
    opt.close();
  }
});

// Réinitialiser quand la modal se ferme
opt.addEventListener("close", () => {
  // Ne réinitialiser que si on n'a pas sauvegardé (currentTask sera null après sauvegarde)
  if (currentTask) {
    // Si la modal se ferme sans sauvegarder, on peut garder les valeurs ou les réinitialiser
    // Pour l'instant, on ne fait rien pour permettre de rouvrir avec les mêmes valeurs
  }
});


