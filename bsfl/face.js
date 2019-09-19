
function face_make(){
  var q = {};

  q.t_skin = random_int(6);
  q.t_eyes = clamp(0, 5, q.t_skin + random_int(3)-1);
  q.t_hair = clamp(0, 5, q.t_skin + random_int(4));

  // face
  q.fw =  4.0 + 0.1 * bounded_std_normal(-2.0, 3.5); // width
  let face_height = 6 + 0.25 * bounded_std_normal(-1.5, 1.5) ; // top
  q.ft = -face_height + 0.03 * bounded_std_normal(-1.5, 1.5) ; // top
  q.fb = face_height  + 0.03 * bounded_std_normal(-1.5, 1.5) ; // bottom

  // skull top
  q.sk1x = q.fw * 1/4;
  q.sk1y = q.ft * 6/6;
  q.sk2x = q.fw * 3/4;
  q.sk2y = q.ft * 5/6; 
  q.sk3x = q.fw * 4/4;
  q.sk3y = q.ft * 3/6;

  // cheekbone
  q.cbw = q.fw + 0.1 * bounded_std_normal(-1,2);       // width
  q.cby = q.fb * 1/6 + 0.2 * bounded_std_normal(-1,1); // y 

  // jaw
  q.jw =  q.fw * 3/4 + 0.2*bounded_std_normal(-1.0, 3.0); // width
  q.jy =  q.fb * 4/6 + 0.3*bounded_std_normal(-1.0, 2.0); // y

  // chin
  q.cw =  1 + 0.3*bounded_std_normal(-3, 1.5); // width

  // eye
  q.ew = 1.03 * q.fw * 0.4 + 0.05*bounded_std_normal(-2,2);  // width = 1/5 of the head width
  q.ecx = 1.05 * q.fw * 0.4 + 0.05*bounded_std_normal(-1,2); // coords of the center
  q.ecy = 0.0;
  q.eh = 0.5 * q.ew + 0.06*bounded_std_normal(-2.0, 2.0);
  q.e_skew_t = 0.12 + 0.05*bounded_std_normal(-3.0, 2.0);  // skew shift
  q.e_skew_b = 0.12 + 0.05*bounded_std_normal(-3.0, 2.0);  // skew shift
  q.e_slant = 0.0 + 0.05*bounded_std_normal(-0.9, 2.0);  // move right and left corners up/down

  q.e1x = q.ecx - 0.5 * q.ew;
  q.e1y = q.ecy + q.eh*q.e_slant;
  
  q.e2x = q.ecx + q.ew * q.e_skew_t;
  q.e2y = q.ecy - 0.5 * q.eh;
  
  q.e3x = q.ecx + 0.5 * q.ew;
  q.e3y = q.ecy - q.eh*q.e_slant;
  
  q.e4x = q.ecx - q.ew * q.e_skew_b;
  q.e4y = q.ecy + 0.5 * q.eh;

  q.e_sh_size = q.eh * (0.4 + 0.1*(2 + bounded_std_normal(-2, 2)));
  q.e_sh_depth = q.eh * (0.25 + 0.1*(2 + bounded_std_normal(-2, 2)));
  q.e_sh_angle = 50 * (q.e_skew_t + q.e_slant);

  // mouth
  q.my = q.fb * (3.75 / 6) + bounded_std_normal(-0.1, 0.1);
  q.mw = q.jw * 0.50 + 0.2 * bounded_std_normal(-0.7, 0.7) + q.t_skin*0.05;
  q.m_smile = q.mw * 0.07 * (0.1 + 0.9*bounded_std_normal(-1.2, 2.0));
  q.mw += 0.9*q.m_smile;

  q.m1x = -q.mw;
  q.m1y = q.my - q.m_smile + 0.15 * bounded_std_normal(-1,1);

  q.m2x = -0.33*q.mw;
  q.m2y = q.my + q.m_smile;
  
  q.m3x = 0.33*q.mw;
  q.m3y = q.my + q.m_smile;
  
  q.m4x = q.mw;
  q.m4y = q.my - q.m_smile + 0.15 * bounded_std_normal(-1,1);

  // lip
  q.ly = q.m2y + 0.7 + 0.2 * bounded_std_normal(-1,1) + q.t_skin * 0.01;
  q.lw = q.mw * 0.3 + 0.05 * bounded_std_normal(-2,2)
    
  // nose
  q.nw = q.ew + 0.25 * bounded_std_normal(-2, 2.0) + q.t_skin*0.02;
  q.ny = q.fb * 2.4 / 6 + 0.05 * bounded_std_normal(-1,2);
  q.n_dir = q.nw * 0.2 * bounded_std_normal(-0.5, 1);

  q.n1x = -0.5 * q.nw;
  q.n1y = q.ny + 0.05 * bounded_std_normal(-2, 2);
  
  q.n2x = 0;
  q.n2y = q.ny + q.n_dir;
  
  q.n3x = 0.5 * q.nw;
  q.n3y = q.ny + 0.05 * bounded_std_normal(-2, 2);

  // ear
  q.ear_h = q.fb * (2.7 / 6) + 0.05 * bounded_std_normal(-2, 2); 
  q.ear_w = q.fw * (0.6 / 4) + 0.3 * bounded_std_normal(-1, 1.5); 
  q.ear_cy = (q.ecy - 0.5*q.eh + q.ny) * 0.5 + 0.05 * bounded_std_normal(-2, 2);

  q.ear_1x = 0;
  q.ear_1y = q.ear_cy - 0.5 * q.ear_h;

  q.ear_2x = q.fw + 0.66 * q.ear_w;
  q.ear_2y = q.ear_cy - 0.5 * q.ear_h;
  
  q.ear_3x = q.fw + q.ear_w           + 0.04 * bounded_std_normal(-2, 2);
  q.ear_3y = q.ear_cy - 0.1 * q.ear_h + 0.08 * bounded_std_normal(-2, 2);
  
  q.ear_4x = q.fw - 0.04 * q.ear_h;
  q.ear_4y = q.ear_cy + 0.5 * q.ear_h;
  
  q.ear_5x = 0;
  q.ear_5y = q.ear_cy + 0.5 * q.ear_h;

  // hair
  q.hr1x = q.fw;
  q.hr1y = 0 + q.fb * 0.1 * bounded_std_normal(-1.7,0.8);
  q.hr2x = q.sk2x       * (0.95 + 0.05 * bounded_std_normal(-1,1));
  q.hr2y = q.sk2y * 0.8 * (0.91 + 0.04 * bounded_std_normal(-1,1));

  q.hr3x = -q.sk2x + Math.random()*(2*q.sk2x);
  q.hr3y = q.hr2y * 1.05 + Math.random() * (q.sk2y - q.hr2y);
  
  q.hr4x = -q.hr2x;
  q.hr4y =  q.hr2y;
  q.hr5x = -q.hr1x;
  q.hr5y =  q.hr1y;
  
  q.hr_length = 1.13 + 0.03 * bounded_std_normal(-1.0, 2.0)

  function scl(x) {
    //return x * (1.1 + 0.05*(bounded_std_normal(-2,2)))
    return x * (q.hr_length + 0.05*(bounded_std_normal(-2,2)))
  }
  q.hr6x = scl(-q.sk3x);
  q.hr6y = scl(q.sk3y);
  q.hr7x = scl(-q.sk2x);
  q.hr7y = scl(q.sk2y);
  q.hr8x = scl(-q.sk1x);
  q.hr8y = scl(q.sk1y);
  q.hr9x = scl(0);
  q.hr9y = scl(q.ft);
  q.hr10x = scl(q.sk1x);
  q.hr10y = scl(q.sk1y);
  q.hr11x = scl(q.sk2x);
  q.hr11y = scl(q.sk2y);
  q.hr12x = scl(q.sk3x);
  q.hr12y = scl(q.sk3y);
  if (Math.random() < 0.09) { 
    q.hr1x = undefined;
  }

  return q;
}

function face_add(div_id, q) {

  function g(x,y) {
    return x + ',' + y;
  }

  function poly(arr, term) {
    return 'M' + arr.join('L') + term;
  }

  var pic = Raphael(div_id, "100%", "100%");
  pic.setViewBox(-8, -8, 16, 16);
  
  let skin_tones = [ // src: https://www.schemecolor.com/real-skin-tones-color-palette.php
    Raphael.rgb(255, 219, 172),
    Raphael.rgb(243, 200, 145),
    Raphael.rgb(241, 194, 125),
    Raphael.rgb(224, 172, 105),
    Raphael.rgb(198, 134, 66),
    Raphael.rgb(141, 85, 36),
  ];

  let eye_tones = [
    Raphael.rgb(120, 150, 200),
    Raphael.rgb(100, 110, 100),
    Raphael.rgb(80, 80, 75),
    Raphael.rgb(60, 60, 50),
    Raphael.rgb(40, 30, 20),
    Raphael.rgb(40, 30, 20),
  ];

  let hair_tones = [
    Raphael.rgb(244, 164, 106),
    Raphael.rgb(255, 236, 189),
    Raphael.rgb(205, 170, 125),
    Raphael.rgb(139, 115, 85),
    Raphael.rgb(75, 55, 45),
    Raphael.rgb(41, 36, 33),
  ];

  var color1 = Raphael.rgb(0, 0, 0);
  var color2 = skin_tones[q.t_skin];
  var color3 = Raphael.rgb(250, 245, 240);
  var color4 = eye_tones[q.t_eyes];
  var color_lit = Raphael.rgb(255,255,255);
  var color_shadow = Raphael.rgb(0,0,0);
  var color_hair = hair_tones[q.t_hair];

  // Drawing

  // draw ears
  var pe1 = pic.path(poly([ 
    g(q.ear_1x, q.ear_1y),
    g(q.ear_2x, q.ear_2y),
    g(q.ear_3x, q.ear_3y),
    g(q.ear_4x, q.ear_4y),
    g(q.ear_5x, q.ear_5y),
  ], ''));
  pe1.attr({stroke: color1, "stroke-width": 0.4, 'stroke-opacity':0.4, 'stroke-linejoin':'round', fill: color2});
  var pe2 = pic.path(poly([ 
    g(-q.ear_1x, q.ear_1y),
    g(-q.ear_2x, q.ear_2y),
    g(-q.ear_3x, q.ear_3y),
    g(-q.ear_4x, q.ear_4y),
    g(-q.ear_5x, q.ear_5y),
  ], ''));
  pe2.attr({stroke: color1, "stroke-width": 0.4, 'stroke-opacity':0.4, 'stroke-linejoin':'round', fill: color2});
  
  var p_neck = pic.path(poly([ 
    g(-q.fw*0.65, 0),
    g(-q.fw*0.7, q.fb),
    g(0, 1.3*q.fb),
    g(q.fw*0.7, q.fb),
    g(q.fw*0.65, 0),
  ], 'Z'));
  p_neck.attr({stroke: color1, "stroke-width": 0.4, 'stroke-opacity':0.4, 'stroke-linejoin':'round', fill: color2});

  // draw face
  var p1 = pic.path(poly([ 
    g(0, q.ft), // top

    g(q.sk1x, q.sk1y),
    g(q.sk2x, q.sk2y),
    g(q.sk3x, q.sk3y),

    g(q.fw, 0), // right 

    g(q.cbw, q.cby),
    g(q.jw, q.jy),
    g(q.cw, q.fb),
    g(0, q.fb),     // bottom
    g(-q.cw, q.fb),
    g(-q.jw, q.jy),
    g(-q.cbw, q.cby),

    g(-q.fw, 0), // left

    g(-q.sk3x, q.sk3y),
    g(-q.sk2x, q.sk2y),
    g(-q.sk1x, q.sk1y),

  ], 'Z'));
  p1.attr({stroke: color1, "stroke-width": 0.4, 'stroke-opacity':0.4, 'stroke-linejoin':'round', fill: color2});
  
  pic.ellipse(q.ecx, q.ecy-q.e_sh_depth, 0.5*q.ew+q.e_sh_size, q.e_sh_size)
    .attr({stroke: color1, "stroke-width": 0, 'stroke-opacity':0, 'fill-opacity':0.15, fill: color_shadow})
    .rotate(-q.e_sh_angle);
  pic.ellipse(-q.ecx, q.ecy-q.e_sh_depth, 0.5*q.ew+q.e_sh_size, q.e_sh_size)
    .attr({stroke: color1, "stroke-width": 0, 'stroke-opacity':0, 'fill-opacity':0.15, fill: color_shadow})
    .rotate(q.e_sh_angle);
  pic.ellipse(q.ecx*1.3, q.ecy+q.eh*1.2, q.ew*0.8, q.eh*0.7).attr({stroke: color1, "stroke-width": 0, 'stroke-opacity':0, 'fill-opacity':0.05, fill: color_lit});
  pic.ellipse(-q.ecx*1.3, q.ecy+q.eh*1.2, q.ew*0.8, q.eh*0.7).attr({stroke: color1, "stroke-width": 0, 'stroke-opacity':0, 'fill-opacity':0.05, fill: color_lit});
  
  // draw eyes
  var p2 = pic.path(poly([ 
    g(q.e1x, q.e1y),
    g(q.e2x, q.e2y),
    g(q.e3x, q.e3y),
    g(q.e4x, q.e4y),
  ], 'Z'));
  p2.attr({stroke: color1, "stroke-width": 0.3, 'stroke-opacity':0.5, 'stroke-linejoin':'round', fill: color3});
  
  var p3 = pic.path(poly([ 
    g(-q.e1x, q.e1y),
    g(-q.e2x, q.e2y),
    g(-q.e3x, q.e3y),
    g(-q.e4x, q.e4y),
  ], 'Z'));
  p3.attr({stroke: color1, "stroke-width": 0.3, 'stroke-opacity':0.5, 'stroke-linejoin':'round', fill: color3});
  
  var p4 = pic.circle(q.ecx, q.ecy, 0.4*q.eh).attr({stroke: color1, "stroke-width": 0, fill: color4});
  var p5 = pic.circle(-q.ecx, q.ecy, 0.4*q.eh).attr({stroke: color1, "stroke-width": 0, fill: color4});
  
  // draw mouth
  var p6 = pic.path(poly([ 
    g(q.m1x, q.m1y),
    g(q.m2x, q.m2y),
    g(q.m3x, q.m3y),
    g(q.m4x, q.m4y),
  ]));
  p6.attr({stroke: color1, "stroke-width": 0.35, 'stroke-opacity':0.5, 'stroke-linejoin':'round'});

  var p7 = pic.path(poly([ 
    g(-q.lw, q.ly),
    g(q.lw, q.ly),
  ]));
  p7.attr({stroke: color1, "stroke-width": 0.3, 'stroke-opacity':0.4, 'stroke-linejoin':'round'});

  // draw nose
  var p8 = pic.path(poly([ 
    g(q.n1x, q.n1y),
    g(q.n2x, q.n2y),
    g(q.n3x, q.n3y),
  ]));
  p8.attr({stroke: color1, "stroke-width": 0.3, 'stroke-opacity':0.4, 'stroke-linejoin':'round'});

  if (q.hr1x !== undefined) {
    // draw hair
    var p9 = pic.path(poly([ 
      g(q.hr1x, q.hr1y),
      g(q.hr2x, q.hr2y),
      g(q.hr3x, q.hr3y),
      g(q.hr4x, q.hr4y),
      g(q.hr5x, q.hr5y),
      g(q.hr6x, q.hr6y),
      g(q.hr7x, q.hr7y),
      g(q.hr8x, q.hr8y),
      g(q.hr9x, q.hr9y),
      g(q.hr10x, q.hr10y),
      g(q.hr11x, q.hr11y),
      g(q.hr12x, q.hr12y),
    ], 'Z'));
    p9.attr({stroke: color1, "stroke-width": 0.3, 'stroke-opacity':0.4, 'stroke-linejoin':'round', fill:color_hair});
  }
}

let Face = {
  make : face_make,
  add : face_add,
};


