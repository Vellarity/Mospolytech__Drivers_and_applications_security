use sha2::{Sha256, Digest};
use base64ct::{Base64, Encoding};
use exe::*;
use std::env;

fn main() {
    let args:Vec<String> = env::args().collect();

    let pe_file = VecPE::from_disk_file(args[1].parse::<String>().unwrap()).unwrap();

    let section_table = pe_file.get_section_table().unwrap();

    let mut hasher = Sha256::new();
    hasher.update(section_table[0].read(&pe_file).unwrap());
    let text_dot_hash = hasher.finalize();
  
    let mut buf = [0u8; 256];
    let based_hash = Base64::encode(&text_dot_hash, &mut buf).unwrap();
  
    println!("{:?}",based_hash);
}
