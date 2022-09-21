/*
// This structure cannot be printed either with `fmt::Display` or
// with `fmt::Debug`.
`struct UnPrintable(i32);`

// The `derive` attribute automatically creates the implementation
// required to make this `struct` printable with `fmt::Debug`.
```
#[derive(Debug)]
struct DebugPrintable(i32);
```
*/
#[derive(Debug)]
#[allow(dead_code)] // no warning on unread args - comment out and compile to see warnings
struct Person<'a> {
    name: &'a str,
    age: u8
}

fn main() {
    let name = "Peter";
    let age = 27;
    let peter = Person { name, age };

    // Pretty print
    println!("{:#?}", peter);
}