/*document.addEventListener("DOMContentLoaded", e => {
    e.preventDefault();
    console.log("chargé");
    let parents, child, i, target;
    child = ["Linux", "OS", "Android"];
    parents = document.querySelectorAll("section")[1];
    for (let i = 0; i < parents.childNodes.length; i++) {
        console.log(parents.childNodes[i]);
    }
    el = document.createElement("ul");
    parents.prepend(el);
    for (data of child) {
        el.innerHTML += `<li>${data}</<li>`;
    }
    target = document.querySelector("footer p");
    let date = new Date();
    console.log(date.getFullYear());
    target.innerHTML += date.getFullYear();
});*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    function skills_events() {
        function events() {
            let categories = document.querySelectorAll('#skills_section .box .menu .category');
            let skills_lists = document.querySelectorAll('#skills_section .box .box_content .skills_list');

            function choose(i) {
                let skill_selector = document.querySelector('#skills_section .box .menu .selector');
                skill_selector.style.top = 100 / categories.length * i + '%';

                for (let j = 0; j < categories.length; j++) categories[j].style.cursor = 'pointer';

                categories[i].style.cursor = 'default';

                for (let j = 0; j < skills_lists.length; j++) skills_lists[j].style.display = 'none';

                skills_lists[i].style.display = 'grid';
            }

            for (let i = 0; i < categories.length; i++) {
                categories[i].addEventListener('click', e => {
                    choose(i);
                });
            }

            choose(0);
        }

        function generate_skills(my_data) {
            let box = document.querySelector('#skills_section .box');
            box.innerHTML = '';

            if (window.innerWidth > 930) {
                let menu = '';
                let box_content = '';

                menu += `<div class="selector" style="height: calc(100% / ${my_data.skills_categories.length})"></div>`;

                for (let category of my_data.skills_categories) {
                    menu += `<div class="category">${category.name}</div>`;

                    let skills = '';

                    for (let skill of category.skills) {
                        if (skill.invert) {
                            skills += `<a class="skill" href="${skill.link}" target="_blank">
                            <img src="${skill.logo}" alt="${skill.name.toLowerCase()}" style="filter: invert(${skill.invert});" width="190px" height="190px"/>
                            <span>${skill.name}</span>
                        </a>`;
                        } else {
                            skills += `<a class="skill" href="${skill.link}" target="_blank">
                            <img src="${skill.logo}" alt="${skill.name.toLowerCase()}" width="190px" height="190px"/>
                            <span>${skill.name}</span>
                        </a>`;
                        }
                    }

                    box_content += `<div class="skills_list">${skills}</div>`;
                }

                box.innerHTML = `<div class="menu">${menu}</div><div class="box_content">${box_content}</div>`;

                events();
            } else {
                for (let category of my_data.skills_categories) {
                    box.innerHTML += `<div class="category_title">${category.name}</div>`;

                    let skills = '';

                    for (let skill of category.skills) {
                        skills += `<a class="skill" href="${skill.link}" target="_blank">
                            <img src="${skill.logo}" alt="${skill.name.toLowerCase()}" width="190px" height="190px"/>
                            <span>${skill.name}</span>
                        </a>`;
                    }

                    box.innerHTML += `<div class="box_content"><div class="skills_list">${skills}</div></div>`;
                }
            }
        }

        let prev_width = window.innerWidth;
        console.log(read_json('../data/skill.json', generate_skills));
        read_json('../data/skill.json', generate_skills);

        window.addEventListener('resize', () => {
            if (prev_width >= 930 && window.innerWidth <= 930 || prev_width <= 930 && window.innerWidth >= 930) {
                read_json('../data/skills.json', generate_skills);
                prev_width = window.innerWidth;
            }
        });
    }
    function read_json(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let my_data = JSON.parse(xhr.responseText);
                    callback(my_data);
                } else {
                    console.log('Error pJS - XMLHttpRequest status: ' + xhr.status);
                    console.log('Error pJS - File config not found');
                }
            }
        };
    
        xhr.send();
    }
    skills_events();

    // Fonction pour agrandir une image au clic
    function agrandirImage(image) {
        // Créez une div pour l'image agrandie
        const agrandissementDiv = document.createElement('div');
        agrandissementDiv.classList.add('agrandissement');

        // Créez une copie de l'image et ajoutez-la à la div
        const agrandissementImage = document.createElement('img');
        agrandissementImage.src = image.src;
        agrandissementImage.alt = image.alt;
        agrandissementDiv.appendChild(agrandissementImage);

        // Ajoutez un bouton de fermeture à la div
        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.addEventListener('click', () => {
            // Retirez la div agrandie lorsque le bouton est cliqué
            agrandissementDiv.remove();
        });
        agrandissementDiv.appendChild(closeButton);

        // Ajoutez un événement de clic à la fenêtre agrandie pour la fermer
        agrandissementDiv.addEventListener('click', event => {
            // Vérifiez si l'élément cliqué est la fenêtre agrandie elle-même (pas un enfant)
            if (event.target === agrandissementDiv) {
                // Retirez la div agrandie lorsque l'utilisateur clique en dehors de l'image
                agrandissementDiv.remove();
            }
        });

        // Ajoutez la div agrandie au corps du document
        document.body.appendChild(agrandissementDiv);

        // Ajustez le z-index pour être au-dessus de tous les autres éléments
        agrandissementDiv.style.zIndex = '10';
    }

    // Sélectionnez toutes les balises d'image dans la liste
    const images = document.querySelectorAll('.creation ul li img');

    // Parcourez chaque image et ajoutez un écouteur d'événements pour le clic
    images.forEach(image => {
        image.addEventListener('click', () => {
            agrandirImage(image);
        });
    });
});