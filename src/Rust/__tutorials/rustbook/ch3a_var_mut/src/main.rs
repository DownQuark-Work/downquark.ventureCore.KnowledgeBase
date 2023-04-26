const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3; // type of the value must be annotated.

fn main() {
  let w = 13;
  let mut x = 5;
  println!("The value of x is: {x}, w: {w}");
  x = 6;
  // w = 12; // <-- throws due to immutability
  println!("The value of x is: {x}, w: {w}, THREE_HOURS_IN_SECONDS: {THREE_HOURS_IN_SECONDS}");    

  let shadowedvar = 5;
  let shadowedvar = shadowedvar + 1;
  { let shadowedvar = shadowedvar * 2; // got nothing on js scoping :p  
    println!("The value of shadowedvar in the inner scope is: {shadowedvar}"); }
  println!("The value of shadowedvar is: {shadowedvar}");

  // Shadowing helps when changing types: below works
  let spaces = "   "; // typeof string
  let spaces = spaces.len(); // typeof int
    // but NOT mutating types: below throws
  /*let mut spaces = "   ";
  spaces = spaces.len();*/
  println!("spaces was correctly typecast from string to int with: {spaces}")
}