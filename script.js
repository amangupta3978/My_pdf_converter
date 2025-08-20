const drop = document.getElementById('drop');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const convertBtn = document.getElementById('convertBtn');
const gallery = document.getElementById('gallery');
const status = document.getElementById('status');
const progressWrap = document.getElementById('progressWrap');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let selectedFile = null;
let selectedFormat = 'png';

// Format chips
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedFormat = chip.dataset.value;
  });
});
chips[0].click(); // default

// Drag & Drop
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{
  e.preventDefault(); drop.classList.add('drag');
}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{
  e.preventDefault(); drop.classList.remove('drag');
}));
drop.addEventListener('drop', e => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if(f) setFile(f);
});

selectBtn.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', e=>{
  const f = e.target.files[0]; if(f) setFile(f);
});

function setFile(f){
  selectedFile = f;
  drop.innerHTML = `
    <strong>${escapeHtml(f.name)}</strong>
    <div class="meta">${(f.size/1024).toFixed(1)} KB • ${f.type || 'unknown'}</div>
  `;
  status.textContent = '';
  gallery.innerHTML = '';
}

convertBtn.addEventListener('click', async ()=>{
  if(!selectedFile){ status.textContent = '⚠ Please choose a file first.'; return; }
  status.textContent = 'Uploading...';
  progressWrap.style.display = 'block';
  setProgress(10,'Uploading');

  // Simulated job (replace with backend API)
  setTimeout(()=>{ setProgress(60,'Processing...'); },1500);
  setTimeout(()=>{ setProgress(100,'Done'); showDemoImage(); status.textContent='Completed'; },3000);
});

function showDemoImage(){
  gallery.innerHTML = `
    <div class="thumb">
      <img src="https://via.placeholder.com/200x150.png?text=Converted+Image" alt="Converted preview">
      <div class="meta">${selectedFormat.toUpperCase()} — 200×150</div>
      <a href="#" class="btn" style="margin-top:8px;display:inline-block;font-size:0.85rem;text-decoration:none">Download</a>
    </div>`;
}

function setProgress(p, txt){
  progressBar.style.width = Math.min(100,Math.max(0,Math.round(p))) + '%';
  progressText.textContent = txt;
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
