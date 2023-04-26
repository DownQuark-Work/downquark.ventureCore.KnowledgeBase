# [Rust Book](https://doc.rust-lang.org/book/title-page.html)
## Basic
- `% cargo new <NAME>`

## Reference
- https://doc.rust-lang.org/book/appendix-00.html

## Docs
- https://doc.rust-lang.org/cargo/
- https://doc.rust-lang.org/std/prelude/index.html
  - https://doc.rust-lang.org/std/io/struct.Stdin.html#method.read_line
  
  ## Crates
  > `% cargo build` after CRUDing crates
  > `% cargo update` to get the most recent
  -
  > **THIS needs its own line:
  > - `% cargo doc --open`  build documentation provided by all your dependencies locally and open it in your browser
  -
  https://crates.io/
  https://crates.io/crates/rand

  ### _misc
  > Signed and unsigned refer to whether it’s possible for the number to be negative—in other words, whether the number needs to have a sign with it (**signed** e.g.:`i8`) or whether it will only ever be positive and can therefore be represented without a sign (**unsigned** e.g.:`u8`)
  > > integer types default to `i32`
  > All floating-point types are signed.
  > >  The default type is `f64`

  > Arrays are useful when you want your data allocated on the stack rather than the heap or when you want to ensure you always have a fixed number of elements. An array isn’t as flexible as the vector type, though. A vector is a similar collection type provided by the standard library that is allowed to grow or shrink in size. If you’re unsure whether to use an array or a vector, chances are you should use a vector.

  > Labeled loops: search for `loop_a_label` (_ch3c_functions_)