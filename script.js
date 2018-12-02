

const getResponse =(search) => {
  const repositoriesUrl = `https://api.github.com/users/${search}/repos`;
  const userDataUrl = `https://api.github.com/users/${search}`;

  const repos = fetch(repositoriesUrl).then(res => res.json());
  const userData = fetch(userDataUrl).then(res => res.json());
  
  return Promise.all([repos, userData]);
};

const repoComponent = (repo) => {
    const wrapper = document.createElement('h3');
    const link =  document.createElement('a');
    const starsContainer = document.createElement('span');
    const forksContainer = document.createElement('span');
    const repoName = document.createTextNode(repo.name);
    const startsCount = document.createTextNode(repo.stargazers_count);
    const forksCount = document.createTextNode(repo.forks_count);
    
    starsContainer.classList.add('stars-container');
    starsContainer.appendChild(startsCount);
    forksContainer.appendChild(forksCount);

    link.setAttribute('href', repo.html_url);
    link.appendChild(repoName);
    link.appendChild(starsContainer);
    link.appendChild(forksContainer);
    
    wrapper.appendChild(link);

    return wrapper;
}

const showRepos =(repos, targetElement) => { // Impure - side effects
    repos.forEach(repoData => {
        const li = document.createElement("li");
        const repo = repoComponent(repoData);
        
        li.classList.add("list-group-item");
        li.appendChild(repo);
        targetElement.appendChild(li);
    });
}

const showUserData = (user) => { // Pure
    const bio = user.bio || "This user does not have bio.";

    return `
      <div><img src=${user.avatar_url} width="150" height="150"/></div>
      <div id="userData">
       <h4 class="font-italic">@${user.login}</h4><br>
       <h2>${user.name}</h2><br>
       <p>${bio}</p>
     </div>
    `;   
};

const Result =() => {
    document.getElementById("userForm").addEventListener("submit", function(event){
        event.preventDefault();
        document.getElementById('result-list').innerHTML = "";
        const search = document.getElementById('inputVal').value;
        const er = document.getElementById('errors');
        const resultElement = document.getElementById('result');

        // Get user info
        const repos = getResponse(search)
            .then(results => {
                const resultListElement = document.getElementById('result-list');
                const userDataElement = document.getElementById('userBox');

                const repos = results[0];
                const userData = results[1];

                resultElement.style.display="block";
                er.style.display="none";
                userDataElement.innerHTML = showUserData(userData);
                showRepos(repos, resultListElement);
            })
            .catch(() => {
                er.style.display="block";
                er.innerHTML="Does not exist";
                resultElement.style.display="none"; 
            });     
    });
};
 
Result();





