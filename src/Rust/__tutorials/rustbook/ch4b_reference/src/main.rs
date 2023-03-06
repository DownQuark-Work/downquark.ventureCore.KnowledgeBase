fn calculate_length(s: &String) -> usize { // s is a reference to a String
  // s.push_str(", world"); // THROW - cannot mutate ref by default
  s.len()
} // s goes out of scope. No ownership of what it refers to. Not dropped.
fn change(some_string: &mut String) { // s is a reference to a mutable String
  some_string.push_str(", world");
}
fn main() {
  let default_string_ref = String::from("hello"); // define as default
  let len = calculate_length(&default_string_ref); // pass as refernce argument with _ampersand_ character
  println!("The length of '{}' is {}.", default_string_ref, len);

  let mut mutable_string_ref = String::from("mutable string"); // define as mutable
  change(&mut mutable_string_ref); // pass as mutable refernce argument
  println!("mutable_string_ref is: '{}'", mutable_string_ref);

  mutliple_mut_refs()
}

fn mutliple_mut_refs() {
  println!("if you have a mutable reference to a value, you can have no other references to that value.");

  let mut mutable_ref = String::from("mutable string"); // define as mutable
  { let _ref1 = &mut mutable_ref; } // ref1 goes out of scope here.
  let ref2 = &mut mutable_ref; // make a new reference with no problems
  // let ref3 = &mut mutable_ref; // THROWs - cannot borrow `mutable_ref` as mutable more than once at a time.

  let mut combination_type_ref = String::from("hello");
  let ref4 = &combination_type_ref; // no problem
  let ref5 = &combination_type_ref; // no problem
  // let ref6 = &mut combination_type_ref; // THROWs - cannot simultaneously assign as both immutable AND mutable

  println!("ref1[out of scope], {}, ref3[THROWS], {}, {}, and ref6[THROWS]", ref2, ref4, ref5);
  // variables ref4 and ref5 will not be used after this point
  
  // `ref7` works due to last usage of the immutable refs (`println!`) being before the mutable is introduced
  let ref7 = &mut combination_type_ref;
  println!("ref7: {}",ref7);

  // let reference_to_nothing = dangle(); // THROWs - due to dnaglnig reference
  slice_type();
}
/*
fn dangle() -> &String {  // dangle returns a reference to a String
  let s = String::from("hello");
  &s // return reference to the String, s
} // s goes out of scope & dropped. Its memory is deallocated - ref would be pointing to an invalid String
*/

// fn first_word(s: &String) -> &str { // `&String` type is mutable - `&str` is immutable string literal type
fn first_word(s: &str) -> &str { // Improving the `first_word` function by using a string slice for the type of the `s` parameter
  let bytes = s.as_bytes();
  for (i, &item) in bytes.iter().enumerate()
    { if item == b' ' { return &s[0..i]; } } // `b' '` <- byte literal syntax
  &s[..]
}
fn slice_type() {
  let s = String::from("hello world");
  let hello = &s[..5]; // equivalent to: &s[0..5];
  let world = &s[6..]; // equivalent to: &s[6..11];
  let hello_world = &s[..]; // equivalent to: &s[0..11];
  println!("hello: {}, world: {}, hello_world: {}", hello, world, hello_world);

  let fword = first_word(&s);
  println!("fword: {}", fword);
  string_slices()
}

fn string_slices() { // these will all work
  let my_string = String::from("hello world");
  // `first_word` works on slices of `String`s, whether partial or whole
  let word = first_word(&my_string[0..6]);
  let word = first_word(&my_string[..]);
  // `first_word` also works on references to `String`s, which are equivalent
  // to whole slices of `String`s
  let word = first_word(&my_string);

  let my_string_literal = "hello world";
  // `first_word` works on slices of string literals, whether partial or whole
  let word = first_word(&my_string_literal[0..6]);
  let word = first_word(&my_string_literal[..]);

  // Because string literals *are* string slices already,
  // this works too, without the slice syntax!
  let word = first_word(my_string_literal);
  println!("word: {}", word);

  other_slice_types()
}

fn other_slice_types() {
  let a = [1, 2, 3, 4, 5];
  let a_slice = &a[1..3];
  assert_eq!(a_slice, &[2, 3]);
  println!("a slice: {}", a_slice.len());
}