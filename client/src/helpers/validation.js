export const numberInput = cb => e => {
  const val = e.target.value;
  if(isNaN(+val)) return;

  cb(e);
};
