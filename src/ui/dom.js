export const $=id=>document.getElementById(id);

export function toast(msg){const el=$('toast');
el.textContent=msg;
el.classList.remove('hidden');
clearTimeout(toast.timer);
toast.timer=setTimeout(()=>el.classList.add('hidden'),3500)}
