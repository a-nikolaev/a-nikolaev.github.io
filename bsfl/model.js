
function model_combo(x, y) {
  return 1*(x + y) + 2*(x+y>0 ? x*y/(x+y) : 0.0);
}

function model_f(x) {
  return 5*x + x**2;
}

// sampling of success
function model_sample(x, y) {
  return Math.random() * (model_f(x) + model_f(y)) < model_f(x);
}

// expected success
function model_mean(x, y) {
  return model_f(x) / (model_f(x)+model_f(y));
}

let Model = {
  combo : model_combo,
  sample : model_sample,
  mean : model_mean,
};
