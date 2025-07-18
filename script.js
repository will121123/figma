async function search() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '🔄 搜索中...';

  const headers = {
    'X-Figma-Token': FIGMA_TOKEN
  };

  try {
    const filesRes = await fetch(`https://api.figma.com/v1/teams/${TEAM_ID}/projects`, { headers });
    const projects = await filesRes.json();
    let results = [];

    for (const project of projects.projects) {
      const fileRes = await fetch(`https://api.figma.com/v1/projects/${project.id}/files`, { headers });
      const files = await fileRes.json();
      for (const file of files.files) {
        if (file.name.toLowerCase().includes(keyword)) {
          results.push({
            name: file.name,
            link: `https://www.figma.com/file/${file.key}`,
            thumbnail: file.thumbnail_url || ""
          });
        }
      }
    }

    resultContainer.innerHTML = '';
    if (results.length === 0) {
      resultContainer.innerHTML = '😢 没有找到相关文件';
    } else {
      for (const item of results) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = \`
          <img src="\${item.thumbnail}" alt="preview" />
          <h3>\${item.name}</h3>
          <a href="\${item.link}" target="_blank">打开 Figma</a>
        \`;
        resultContainer.appendChild(card);
      }
    }
  } catch (err) {
    resultContainer.innerHTML = '❌ 发生错误：' + err.message;
  }
}