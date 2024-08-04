
document.addEventListener('DOMContentLoaded', () => {
  setupProfileImageUpload();
  setupEditableFields();
  setupLanguages();
  setupInterests();
  setupEducation();
  setupExperience();
  setupTools();
  loadData();
});

function setupProfileImageUpload() {
  document.getElementById('profileImage').addEventListener('dblclick', () => {
    document.getElementById('photoUpload').click();
  });

  document.getElementById('photoUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('profileImage').src = e.target.result;
        saveData();
      };
      reader.readAsDataURL(file);
    }
  });
}

function setupEditableFields() {
  const fields = ['emailHeading', 'emailAddress', 'profileName', 'profileTitle'];
  fields.forEach((fieldId) => {
    document.getElementById(fieldId).addEventListener('input', saveData);
  });
}

function loadData() {
  const emailHeading = localStorage.getItem('emailHeading');
  const emailAddress = localStorage.getItem('emailAddress');
  const profileName = localStorage.getItem('profileName');
  const profileTitle = localStorage.getItem('profileTitle');
  const profileImage = localStorage.getItem('profileImage');

  if (emailHeading) document.getElementById('emailHeading').textContent = emailHeading;
  if (emailAddress) document.getElementById('emailAddress').textContent = emailAddress;
  if (profileName) document.getElementById('profileName').textContent = profileName;
  if (profileTitle) document.getElementById('profileTitle').textContent = profileTitle;
  if (profileImage) document.getElementById('profileImage').src = profileImage;
}

function saveData() {
  localStorage.setItem('emailHeading', document.getElementById('emailHeading').textContent);
  localStorage.setItem('emailAddress', document.getElementById('emailAddress').textContent);
  localStorage.setItem('profileName', document.getElementById('profileName').textContent);
  localStorage.setItem('profileTitle', document.getElementById('profileTitle').textContent);
  localStorage.setItem('profileImage', document.getElementById('profileImage').src);
}

function setupLanguages() {
  const addLanguageButton = document.getElementById('addLanguageButton');
  const languageModal = document.getElementById('languageModal');
  const closeLanguageModal = document.querySelector('#languageModal .close');
  const saveLanguageButton = document.getElementById('saveLanguageButton');
  const cancelLanguageButton = document.getElementById('cancelLanguageButton');
  const languagesList = document.getElementById('languagesList');
  const languageSelect = document.getElementById('languageSelect');
  const languagePercentage = document.getElementById('languagePercentage');

  const loadLanguages = () => {
    const languages = JSON.parse(localStorage.getItem('languages')) || [];
    languages.forEach(lang => addLanguageBar(lang.language, lang.percentage));
  };

  const saveLanguages = () => {
    const languages = [];
    document.querySelectorAll('.language-bar').forEach(bar => {
      const language = bar.querySelector('span').textContent;
      const percentage = bar.querySelector('.bar').style.width;
      languages.push({ language, percentage: parseInt(percentage) });
    });
    localStorage.setItem('languages', JSON.stringify(languages));
  };

  const addLanguageBar = (language, percentage) => {
    const languageBar = document.createElement('div');
    languageBar.classList.add('language-bar');
    languageBar.innerHTML = `
            <span>${language}</span>
            <div class="bar-container">
                <div class="bar" style="width: ${percentage}%;"></div>
            </div>
            <div class="delete-button"></div>`;

    languageBar.querySelector('.delete-button').addEventListener('click', () => {
      languageBar.remove();
      saveLanguages();
    });

    languagesList.appendChild(languageBar);
  };

  addLanguageButton.addEventListener('click', () => {
    languageModal.style.display = 'block';
  });

  closeLanguageModal.addEventListener('click', () => {
    languageModal.style.display = 'none';
  });

  cancelLanguageButton.addEventListener('click', () => {
    languageModal.style.display = 'none';
  });

  saveLanguageButton.addEventListener('click', () => {
    const language = languageSelect.value;
    const percentage = languagePercentage.value;

    if (language && percentage) {
      addLanguageBar(language, percentage);
      saveLanguages();
      languageModal.style.display = 'none';
      languagePercentage.value = '';
    } else {
      alert('Пожалуйста, выберите язык и введите процент знания.');
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target == languageModal) {
      languageModal.style.display = 'none';
    }
  });

  loadLanguages();
}

function setupInterests() {
  const addInterestButton = document.getElementById('addInterestButton');
  const interestModal = document.getElementById('interestModal');
  const closeInterestModal = document.querySelector('#interestModal .close');
  const saveInterestButton = document.getElementById('saveInterestButton');
  const cancelInterestButton = document.getElementById('cancelInterestButton');
  const interestsList = document.getElementById('interestsList');
  const interestInput = document.getElementById('interestInput');
  let editInterest = null;

  const loadInterests = () => {
    const interests = JSON.parse(localStorage.getItem('interests')) || [];
    interests.forEach(interest => addInterestItem(interest));
  };

  const saveInterests = () => {
    const interests = [];
    document.querySelectorAll('.interest-item span').forEach(item => {
      interests.push(item.textContent);
    });
    localStorage.setItem('interests', JSON.stringify(interests));
  };

  const addInterestItem = (interest) => {
    const interestItem = document.createElement('div');
    interestItem.classList.add('interest-item');
    interestItem.innerHTML = `
            <span>${interest}</span>
            <div class="delete-button"></div>`;

    interestItem.querySelector('.delete-button').addEventListener('click', (event) => {
      event.stopPropagation();
      interestItem.remove();
      saveInterests();
    });

    interestItem.addEventListener('click', () => {
      editInterest = interestItem;
      interestInput.value = interestItem.querySelector('span').textContent;
      interestModal.style.display = 'block';
    });

    interestsList.appendChild(interestItem);
  };

  addInterestButton.addEventListener('click', () => {
    editInterest = null;
    interestInput.value = '';
    interestModal.style.display = 'block';
  });

  closeInterestModal.addEventListener('click', () => {
    interestModal.style.display = 'none';
  });

  cancelInterestButton.addEventListener('click', () => {
    interestModal.style.display = 'none';
  });

  saveInterestButton.addEventListener('click', () => {
    const interest = interestInput.value.trim();

    if (interest) {
      if (editInterest) {
        editInterest.querySelector('span').textContent = interest;
      } else {
        addInterestItem(interest);
      }
      saveInterests();
      interestModal.style.display = 'none';
    } else {
      alert('Пожалуйста, введите интерес.');
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target == interestModal) {
      interestModal.style.display = 'none';
    }
  });

  loadInterests();
}

function setupEducation() {
  const addEducationButton = document.getElementById('addEducationButton');
  const educationModal = document.getElementById('educationModal');
  const closeEducationModal = document.querySelector('#educationModal .close');
  const saveEducationButton = document.getElementById('saveEducationButton');
  const cancelEducationButton = document.getElementById('cancelEducationButton');
  const educationList = document.getElementById('educationList');
  const educationYearStart = document.getElementById('educationYearStart');
  const educationYearEnd = document.getElementById('educationYearEnd');
  const educationDirection = document.getElementById('educationDirection');
  const educationHashtags = document.getElementById('educationHashtags');
  const educationPlace = document.getElementById('educationPlace');
  let editEducation = null;

  const loadEducation = () => {
    const education = JSON.parse(localStorage.getItem('education')) || [];
    education.forEach(ed => addEducationItem(ed.yearStart, ed.yearEnd, ed.direction, ed.hashtags, ed.place, ed.favorite));
  };

  const saveEducation = () => {
    const education = [];
    document.querySelectorAll('.education-item').forEach(item => {
      const yearStart = item.querySelector('.year-start').textContent;
      const yearEnd = item.querySelector('.year-end').textContent;
      const direction = item.querySelector('.direction').textContent;
      const hashtags = item.querySelector('.hashtags').textContent;
      const place = item.querySelector('.place').textContent;
      const favorite = item.classList.contains('favorite');
      education.push({ yearStart, yearEnd, direction, hashtags, place, favorite });
    });
    localStorage.setItem('education', JSON.stringify(education));
  };

  const addEducationItem = (yearStart, yearEnd, direction, hashtags, place, favorite = false) => {
    const educationItem = document.createElement('div');
    educationItem.classList.add('education-item');
    if (favorite) {
      educationItem.classList.add('favorite');
    }
    educationItem.innerHTML = `
          <div class="year-start">${yearStart}</div>
          ${yearEnd ? `<div class="year-end">${yearEnd}</div>` : ''}
          <div class="direction">${direction}</div>
          <div class="hashtags">${hashtags}</div>
          <div class="place">${place}</div>
          <div class="heart-container">
            <img src="heart.png" class="heart-icon" />
          </div>
          <div class="delete-button"></div>`;

    const heartIcon = educationItem.querySelector('.heart-icon');
    heartIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      if (educationItem.classList.contains('favorite')) {
        educationItem.classList.remove('favorite');
        heartIcon.src = 'heart.png';
      } else {
        educationItem.classList.add('favorite');
        heartIcon.src = 'yellowheart.png';
      }
      saveEducation();
    });

    educationItem.querySelector('.delete-button').addEventListener('click', (event) => {
      event.stopPropagation();
      educationItem.remove();
      saveEducation();
    });

    educationItem.addEventListener('click', () => {
      editEducation = educationItem;
      educationYearStart.value = educationItem.querySelector('.year-start').textContent;
      educationYearEnd.value = educationItem.querySelector('.year-end').textContent || '';
      educationDirection.value = educationItem.querySelector('.direction').textContent;
      educationHashtags.value = educationItem.querySelector('.hashtags').textContent;
      educationPlace.value = educationItem.querySelector('.place').textContent;
      educationModal.style.display = 'block';
    });

    educationList.appendChild(educationItem);
  };

  const validateYears = () => {
    const yearStart = parseInt(educationYearStart.value.trim(), 10);
    const yearEnd = parseInt(educationYearEnd.value.trim(), 10);
    if (isNaN(yearStart) || (yearEnd !== '' && isNaN(yearEnd))) {
      alert('Пожалуйста, введите корректные числа для годов.');
      return false;
    }
    if (yearEnd !== '' && yearStart > yearEnd) {
      alert('Конечный год не может быть раньше начального.');
      return false;
    }
    return true;
  };

  addEducationButton.addEventListener('click', () => {
    editEducation = null;
    educationYearStart.value = '';
    educationYearEnd.value = '';
    educationDirection.value = '';
    educationHashtags.value = '';
    educationPlace.value = '';
    educationModal.style.display = 'block';
  });

  closeEducationModal.addEventListener('click', () => {
    educationModal.style.display = 'none';
  });

  cancelEducationButton.addEventListener('click', () => {
    educationModal.style.display = 'none';
  });

  saveEducationButton.addEventListener('click', () => {
    const yearStart = educationYearStart.value.trim();
    const yearEnd = educationYearEnd.value.trim();
    const direction = educationDirection.value.trim();
    const hashtags = educationHashtags.value.trim();
    const place = educationPlace.value.trim();

    if (validateYears() && yearStart && direction && hashtags && place) {
      const displayYearEnd = yearEnd && yearStart !== yearEnd ? ` - ${yearEnd}` : '';
      const yearDisplay = `${yearStart}${displayYearEnd}`;
      if (editEducation) {
        editEducation.querySelector('.year-start').textContent = yearStart;
        editEducation.querySelector('.year-end').textContent = yearEnd || '';
        editEducation.querySelector('.direction').textContent = direction;
        editEducation.querySelector('.hashtags').textContent = hashtags;
        editEducation.querySelector('.place').textContent = place;
      } else {
        addEducationItem(yearStart, yearEnd || '', direction, hashtags, place, educationList.childElementCount === 0);
      }
      saveEducation();
      educationModal.style.display = 'none';
    } else {
      alert('Пожалуйста, заполните все поля.');
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target == educationModal) {
      educationModal.style.display = 'none';
    }
  });

  loadEducation();
}


function setupExperience() {
  const addExperienceButton = document.getElementById('addExperienceButton');
  const experienceModal = document.getElementById('experienceModal');
  const closeExperienceModal = document.querySelector('#experienceModal .close');
  const saveExperienceButton = document.getElementById('saveExperienceButton');
  const cancelExperienceButton = document.getElementById('cancelExperienceButton');
  const experienceList = document.getElementById('experienceList');
  const experienceStartDate = document.getElementById('experienceStartDate');
  const experienceEndDate = document.getElementById('experienceEndDate');
  const experiencePresent = document.getElementById('experiencePresent');
  const experienceTitle = document.getElementById('experienceTitle');
  const experienceCompany = document.getElementById('experienceCompany');
  const experienceDescription = document.getElementById('experienceDescription');
  let editExperience = null;

  const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  const loadExperience = () => {
    const experience = JSON.parse(localStorage.getItem('experience')) || [];
    experience.forEach(exp => addExperienceItem(exp.period, exp.title, exp.company, exp.description, exp.mostRecent));
    highlightMostRecentExperience();
  };

  const saveExperience = () => {
    const experience = [];
    document.querySelectorAll('.experience-item').forEach(item => {
      const period = item.querySelector('.period').textContent;
      const title = item.querySelector('.title').textContent;
      const company = item.querySelector('.company').textContent;
      const description = item.querySelector('.description').textContent;
      const mostRecent = item.classList.contains('most-recent');
      experience.push({ period, title, company, description, mostRecent });
    });
    localStorage.setItem('experience', JSON.stringify(experience));
  };

  const addExperienceItem = (period, title, company, description, mostRecent = false) => {
    const experienceItem = document.createElement('div');
    experienceItem.classList.add('experience-item');
    if (mostRecent) {
      experienceItem.classList.add('most-recent');
    }
    experienceItem.innerHTML = `
      <div class="left-column">
          <div class="period">${period}</div>
          <div class="title">${title}</div>
          <div class="company">${company}</div>
      </div>
      <div class="right-column">
          <div class="description">${description}</div>
      </div>
      <div class="delete-button"></div>`;

    if (mostRecent) {
      const mostRecentIcon = document.createElement('div');
      mostRecentIcon.classList.add('most-recent-icon');
      experienceItem.appendChild(mostRecentIcon);
    }

    experienceItem.querySelector('.delete-button').addEventListener('click', (event) => {
      event.stopPropagation();
      experienceItem.remove();
      saveExperience();
      highlightMostRecentExperience();
    });

    experienceItem.addEventListener('click', () => {
      editExperience = experienceItem;
      const period = experienceItem.querySelector('.period').textContent;
      const dates = period.split(' - ');
      experienceStartDate.value = new Date(dates[0]).toISOString().split('T')[0];
      experienceEndDate.value = dates[1] !== 'Present' ? new Date(dates[1]).toISOString().split('T')[0] : '';
      experiencePresent.checked = dates[1] === 'Present';
      experienceTitle.value = experienceItem.querySelector('.title').textContent;
      experienceCompany.value = experienceItem.querySelector('.company').textContent;
      experienceDescription.value = experienceItem.querySelector('.description').textContent;
      experienceModal.style.display = 'block';
    });

    experienceList.appendChild(experienceItem);
    sortExperienceList();
  };

  const highlightMostRecentExperience = () => {
    let mostRecentExperience = null;
    document.querySelectorAll('.experience-item').forEach(item => {
      const period = item.querySelector('.period').textContent.split(' - ')[1];
      const endDate = period === 'Present' ? new Date() : new Date(period);
      if (!mostRecentExperience || endDate > new Date(mostRecentExperience.querySelector('.period').textContent.split(' - ')[1])) {
        if (mostRecentExperience) {
          mostRecentExperience.classList.remove('most-recent');
          mostRecentExperience.querySelector('.most-recent-icon').remove();
        }
        mostRecentExperience = item;
      }
    });
    if (mostRecentExperience) {
      mostRecentExperience.classList.add('most-recent');
      const mostRecentIcon = document.createElement('div');
      mostRecentIcon.classList.add('most-recent-icon');
      mostRecentExperience.appendChild(mostRecentIcon);
    }
  };

  const sortExperienceList = () => {
    const items = Array.from(experienceList.children);
    items.sort((a, b) => {
      const dateA = new Date(a.querySelector('.period').textContent.split(' - ')[1] === 'Present' ? new Date() : a.querySelector('.period').textContent.split(' - ')[1]);
      const dateB = new Date(b.querySelector('.period').textContent.split(' - ')[1] === 'Present' ? new Date() : b.querySelector('.period').textContent.split(' - ')[1]);
      return dateB - dateA;
    });
    items.forEach(item => experienceList.appendChild(item));
  };

  const validateDates = () => {
    const startDate = new Date(experienceStartDate.value);
    const endDate = new Date(experienceEndDate.value);
    if (startDate > endDate && !experiencePresent.checked) {
      alert('Начальная дата не может быть позже конечной.');
      return false;
    }
    return true;
  };

  experiencePresent.addEventListener('change', () => {
    experienceEndDate.disabled = experiencePresent.checked;
    if (experiencePresent.checked) {
      experienceEndDate.value = '';
    }
  });

  addExperienceButton.addEventListener('click', () => {
    editExperience = null;
    experienceStartDate.value = '';
    experienceEndDate.value = '';
    experiencePresent.checked = false;
    experienceEndDate.disabled = false;
    experienceTitle.value = '';
    experienceCompany.value = '';
    experienceDescription.value = '';
    experienceModal.style.display = 'block';
  });

  closeExperienceModal.addEventListener('click', () => {
    experienceModal.style.display = 'none';
  });

  cancelExperienceButton.addEventListener('click', () => {
    experienceModal.style.display = 'none';
  });

  saveExperienceButton.addEventListener('click', () => {
    const startDate = experienceStartDate.value.trim();
    let endDate = experienceEndDate.value.trim();
    const present = experiencePresent.checked;
    const title = experienceTitle.value.trim();
    const company = experienceCompany.value.trim();
    const description = experienceDescription.value.trim();

    if (present) {
      endDate = 'Present';
    }

    if (validateDates() && startDate && (endDate || present) && title && company && description) {
      const period = `${formatDate(startDate)} - ${endDate !== 'Present' ? formatDate(endDate) : 'Present'}`;
      if (editExperience) {
        editExperience.querySelector('.period').textContent = period;
        editExperience.querySelector('.title').textContent = title;
        editExperience.querySelector('.company').textContent = company;
        editExperience.querySelector('.description').textContent = description;
      } else {
        addExperienceItem(period, title, company, description);
      }
      saveExperience();
      experienceModal.style.display = 'none';
      highlightMostRecentExperience();
    } else {
      alert('Пожалуйста, заполните все поля.');
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target == experienceModal) {
      experienceModal.style.display = 'none';
    }
  });

  loadExperience();
}




document.addEventListener('DOMContentLoaded', (event) => {
  setupTools();
});

const toolIcons = {
  design: [
    { name: 'Figma', src: 'icons/figma.png' },
    { name: 'Photoshop', src: 'icons/photoshop.png' },
    { name: 'Illustrator', src: 'icons/illustrator.png' },
    { name: 'Premiere Pro', src: 'icons/premiere.png' },
    { name: 'Notion', src: 'icons/notion.png' },
    { name: 'Google Meet', src: 'icons/meet.png' }
  ],
  'no-code': [
    { name: 'Zapier', src: 'icons/zapier.png' },
    { name: 'Webflow', src: 'icons/webflow.png' },
    { name: 'Framer', src: 'icons/framer.png' },
    { name: 'WordPress', src: 'icons/wordpress.png' }
  ],
  'artificial intelligence': [
    { name: 'ChatGPT', src: 'icons/chatgpt.png' },
    { name: 'Stable Diffusion', src: 'icons/stablediffusion.png' }
  ]
};

function setupTools() {
  const addToolButton = document.getElementById('addToolButton');
  const toolModal = document.getElementById('toolModal');
  const closeToolModal = document.querySelector('#toolModal .close');
  const saveToolButton = document.getElementById('saveToolButton');
  const cancelToolButton = document.getElementById('cancelToolButton');
  const toolCategory = document.getElementById('toolCategory');
  const toolIcon = document.getElementById('toolIcon');
  const toolsList = document.getElementById('toolsList');

  const loadTools = () => {
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    toolsList.innerHTML = '';
    const categories = [...new Set(tools.map(tool => tool.category))];
    categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('tools-category');
      categoryDiv.innerHTML = `<h2>${category}</h2><div class="tools-items"></div>`;
      tools.filter(tool => tool.category === category).forEach(tool => {
        addToolItem(tool.name, tool.category, tool.iconSrc, categoryDiv.querySelector('.tools-items'));
      });
      toolsList.appendChild(categoryDiv);
    });
  };

  const saveTools = (tools) => {
    localStorage.setItem('tools', JSON.stringify(tools));
    loadTools();
  };

  const addToolItem = (name, category, iconSrc, container) => {
    const toolItem = document.createElement('div');
    toolItem.classList.add('tools-item');
    toolItem.innerHTML = `<img src="${iconSrc}" alt="${name}"><span>${name}</span><div class="delete-button"></div>`;
    toolItem.querySelector('.delete-button').addEventListener('click', (event) => {
      event.stopPropagation();
      toolItem.remove();
      const tools = JSON.parse(localStorage.getItem('tools')) || [];
      const updatedTools = tools.filter(tool => tool.name !== name);
      saveTools(updatedTools);
    });
    container.appendChild(toolItem);
  };

  const updateToolIcons = () => {
    const category = toolCategory.value;
    toolIcon.innerHTML = '';
    if (toolIcons[category]) {
      toolIcons[category].forEach(icon => {
        const option = document.createElement('option');
        option.value = icon.src;
        option.textContent = icon.name;
        toolIcon.appendChild(option);
      });
      toolIcon.value = toolIcons[category][0].src;
    }
  };

  addToolButton.addEventListener('click', () => {
    toolCategory.value = 'design';
    updateToolIcons();
    toolModal.style.display = 'block';
  });

  closeToolModal.addEventListener('click', () => {
    toolModal.style.display = 'none';
  });

  cancelToolButton.addEventListener('click', () => {
    toolModal.style.display = 'none';
  });

  saveToolButton.addEventListener('click', () => {
    const category = toolCategory.value;
    const iconSrc = toolIcon.value;
    const name = toolIcons[category].find(icon => icon.src === iconSrc).name;

    if (category && iconSrc) {
      const tools = JSON.parse(localStorage.getItem('tools')) || [];
      tools.push({ name, category, iconSrc });
      saveTools(tools);
      toolModal.style.display = 'none';
    } else {
      alert('Пожалуйста, заполните все поля.');
    }
  });

  toolCategory.addEventListener('change', updateToolIcons);

  window.addEventListener('click', (event) => {
    if (event.target === toolModal) {
      toolModal.style.display = 'none';
    }
  });
  loadTools();
}

document.getElementById('installButton').addEventListener('click', () => {
  const content = document.querySelector('.content-container');

  const waveButtons = document.querySelectorAll('.wave-button');
  const deleteButtons = document.querySelectorAll('.delete-button');

  waveButtons.forEach(button => button.style.display = 'none');
  deleteButtons.forEach(button => button.style.display = 'none');
  html2canvas(content, {
    onrendered: function (canvas) {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'p', 
        unit: 'mm', 
        format: 'a4' 
      });

      const imgWidth = 210; 
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('CV.pdf');
      waveButtons.forEach(button => button.style.display = '');
      deleteButtons.forEach(button => button.style.display = '');
    }

  });
});
