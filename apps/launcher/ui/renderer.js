const $=id=>document.getElementById(id);
let current,filter='all',view=localStorage.getItem('bluecloud-view')||'grid',uiError='';
const jobs=new Map();
const asset={coneic:'coneic.png',quranly:'quranly.png',tooldeck:'tooldeck.png'};
function element(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function updateAvailable(p){const release=current.releases.find(r=>r.appId===p.id);return Boolean(current.installed[p.id]&&release?.updateAvailable);}
function notice(){const message=uiError||current?.error||'';$('notice').textContent=message;$('notice').hidden=!message;}
async function action(name,id){
  uiError='';if(name==='install'||name==='uninstall'){jobs.set(id,{phase:name==='install'?'Preparing':'Removing',percent:0});render();}
  try{const result=await window.bluecloud[name](id);if(!result.ok)throw Error(result.error);current=result.state;if(name==='install')uiError=`${current.products.find(p=>p.id===id)?.name||'App'} is ready to open.`;}
  catch(error){uiError=error.message;}
  finally{jobs.delete(id);if(['install','uninstall','cancel'].includes(name)){try{const result=await window.bluecloud.state();if(result.ok)current=result.state;}catch{}}if(current)render();else notice();}
}
function button(label,actionName,id,className='primary') {const b=element('button',className,label);b.dataset.action=actionName;b.dataset.app=id;b.onclick=()=>action(actionName,id);return b;}
function links(p){const group=element('div','app-links');for(const [label,kind]of [['Website ↗','website'],['Source ↗','source']]){const b=element('button','link-button',label);b.onclick=()=>action('openLink',{id:p.id,kind});group.append(b);}return group;}
function more(p,release,installed,busy){const detail=element('details','more-menu'),summary=element('summary','','•••');summary.setAttribute('aria-label',`More options for ${p.name}`);const panel=element('div','menu-panel');panel.setAttribute('aria-label',`${p.name} actions`);const notes=element('button','','Release notes');notes.onclick=()=>{detail.open=false;uiError=release?.notes||p.note;notice();};panel.append(notes);if(installed){const remove=button('Remove app','uninstall',p.id,'danger');remove.disabled=busy;panel.append(remove);}detail.append(summary,panel);return detail;}
function status(p,release,installed){if(jobs.has(p.id))return ['Working','working'];if(!installed)return [release?'Ready to install':'Release being prepared','available'];return [updateAvailable(p)?'Update available':'Installed · Up to date',updateAvailable(p)?'update':'installed'];}
function actions(p,release,installed,busy){const group=element('div','app-actions');if(installed){const open=button('Open app ↗','launch',p.id);open.disabled=busy;group.append(open);if(updateAvailable(p)){const update=button('Update ↓','install',p.id,'update-button');update.disabled=busy;group.append(update);}}else{const install=button(release?'Install app ↓':'Coming soon','install',p.id);install.disabled=busy||!release;group.append(install);}group.append(more(p,release,installed,busy));if(busy){const cancel=button('Cancel','cancel',p.id,'cancel-button');group.append(cancel);}return group;}
function progressBlock(p){const block=element('div','download-progress');block.dataset.progress=p.id;block.hidden=!jobs.has(p.id);const text=element('span','progress-text'),bar=element('progress');bar.max=100;bar.setAttribute('aria-label',`${p.name} installation progress`);block.append(text,bar);return block;}
function paintProgress(id){const block=document.querySelector(`[data-progress="${id}"]`),job=jobs.get(id);if(!block||!job)return;block.hidden=false;block.querySelector('.progress-text').textContent=`${job.phase}${job.phase==='Downloading'?` · ${job.percent}%`:''}`;block.querySelector('progress').value=job.percent;}
function appIdentity(p){const identity=element('div','app-identity'),img=element('img','app-icon');img.src=`assets/${asset[p.id]}`;img.alt='';const text=element('div','identity-text');text.append(element('h2','',p.name),element('p','',p.category));identity.append(img,text);return identity;}
function render(){
  if(!current)return;const focus=document.activeElement;const restore=focus?.dataset.action?{action:focus.dataset.action,app:focus.dataset.app}:null;
  const products=current.products.filter(p=>p.id!=='launcher');const counts={all:products.length,installed:products.filter(p=>current.installed[p.id]).length,updates:products.filter(updateAvailable).length,available:products.filter(p=>!current.installed[p.id]).length};
  for(const [key,count]of Object.entries(counts)){$(`count-${key}`).textContent=count;$(key).setAttribute('aria-selected',String(filter===key));$(key).tabIndex=filter===key?0:-1;}
  $('version').textContent=`BLUECLOUD ${current.version}`;$('channel').textContent=`${current.channel.toUpperCase()} CHANNEL`;$('summary').textContent=`${counts.installed} INSTALLED · ${counts.updates} UPDATE${counts.updates===1?'':'S'} AVAILABLE`;$('connection').textContent=current.error?(current.releases.length?'Using saved release information':'Installed apps work offline'):'Release information up to date';
  $('grid').setAttribute('aria-pressed',String(view==='grid'));$('table').setAttribute('aria-pressed',String(view==='table'));notice();
  const q=$('search').value.trim().toLowerCase();const list=products.filter(p=>(filter==='all'||filter==='installed'&&current.installed[p.id]||filter==='updates'&&updateAvailable(p)||filter==='available'&&!current.installed[p.id])&&`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q));
  if($('sort').value==='name')list.sort((a,b)=>a.name.localeCompare(b.name));if($('sort').value==='installed')list.sort((a,b)=>Number(Boolean(current.installed[b.id]))-Number(Boolean(current.installed[a.id])));
  $('library').replaceChildren();$('library').className=view==='table'?'app-table':'app-grid';$('library').hidden=!list.length;$('empty').hidden=Boolean(list.length);$('empty-description').textContent=filter==='updates'&&!q?'Your installed apps are up to date.':'Try another filter or search.';
  if(view==='table'&&list.length){const heading=element('div','table-heading');['Application','Status','Version','Actions'].forEach(t=>heading.append(element('span','',t)));$('library').append(heading);}
  for(const p of list){const release=current.releases.find(r=>r.appId===p.id),installed=current.installed[p.id],busy=jobs.has(p.id)||current.busy.includes(p.id);const [statusText,statusClass]=status(p,release,installed);const card=element('article',`app-card ${p.id}`);card.setAttribute('aria-label',p.name);card.setAttribute('aria-busy',String(busy));
    if(view==='grid'){const top=element('div','card-top');top.append(element('span','app-number',String(products.indexOf(p)+1).padStart(2,'0')),links(p));card.append(top);const body=element('div','card-body');body.append(appIdentity(p),element('p','app-description',p.description),element('span',`app-status ${statusClass}`,statusText),element('p','app-version',`${installed?'Installed':'Version'} ${installed?.version||release?.version||p.version} · Windows x64`),progressBlock(p),actions(p,release,installed,busy));card.append(body);}
    else{card.append(appIdentity(p),element('span',`app-status ${statusClass}`,statusText),element('span','app-version',installed?.version||release?.version||p.version),actions(p,release,installed,busy),progressBlock(p));}
    $('library').append(card);paintProgress(p.id);
  }
  const self=current.releases.find(r=>r.appId==='launcher'&&r.updateAvailable);$('self-update').hidden=!self;if(self){$('self-update').replaceChildren(element('p','',`BlueCloud Launcher ${self.version} is available.`),button('Update launcher','install','launcher','secondary'));}
  if(restore)document.querySelector(`[data-action="${restore.action}"][data-app="${restore.app}"]`)?.focus({preventScroll:true});
}
for(const tab of document.querySelectorAll('[data-filter]')){tab.onclick=()=>{filter=tab.dataset.filter;render();};tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...document.querySelectorAll('[data-filter]')],index=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;filter=tabs[next].dataset.filter;render();tabs[next].focus();});}
for(const type of ['grid','table'])$(type).onclick=()=>{view=type;localStorage.setItem('bluecloud-view',type);render();};
$('search').addEventListener('input',render);$('sort').addEventListener('change',render);
$('reset-filters').onclick=()=>{filter='all';$('search').value='';render();};
$('refresh').onclick=async()=>{$('refresh').disabled=true;$('refresh').setAttribute('aria-label','Checking for updates');await action('refresh');$('refresh').disabled=false;$('refresh').setAttribute('aria-label','Check for updates');};
$('support').onclick=()=>action('openLink',{id:'launcher',kind:'support'});
$('auto-check').checked=localStorage.getItem('bluecloud-auto-check')!=='false';$('auto-check').onchange=()=>localStorage.setItem('bluecloud-auto-check',String($('auto-check').checked));
$('settings-button').onclick=()=>$('settings').showModal();for(const id of ['close-settings','done-settings'])$(id).onclick=()=>$('settings').close();
document.addEventListener('click',event=>document.querySelectorAll('.more-menu[open]').forEach(d=>{if(!d.contains(event.target))d.open=false;}));
document.addEventListener('keydown',event=>{document.body.dataset.keyboard='true';if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('search').focus();}if(event.key==='Escape'){document.querySelectorAll('.more-menu[open]').forEach(d=>d.open=false);if(document.activeElement===$('search')){$('search').value='';render();}}});
document.addEventListener('pointerdown',()=>{delete document.body.dataset.keyboard;});
window.bluecloud.onProgress(data=>{if(data.phase==='Ready'){jobs.delete(data.id);return;}if(data.phase==='Finished'){jobs.delete(data.id);window.bluecloud.state().then(result=>{if(result.ok){current=result.state;render();}});return;}jobs.set(data.id,data);paintProgress(data.id);});
(async()=>{await action('state');if($('auto-check').checked)await action('refresh');})();
