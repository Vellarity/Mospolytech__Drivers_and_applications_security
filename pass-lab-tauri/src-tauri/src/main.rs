#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows",
)]

use windows::{
  Win32::{System::Diagnostics::Debug::IsDebuggerPresent, Foundation::HWND},
};
use windows_sys::{
  Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONERROR}
};
use std::{
  path, fs::*, process::{Command, id, exit}, io::Write
};
use sha2::{Sha256, Digest};
use base64ct::{Base64, Encoding};
use exe::*;

fn main(){
  let child = 
  Command::new("satellite.exe").arg(id().to_string()).spawn();

  const ETALON_HASH:&str = "ffnGDio3G85MSP49WvCvaNUNkzoK9JnXmsCBwkjvJC4=";

  let pe_file;
  if cfg!(debug_assertions) {
    pe_file = VecPE::from_disk_file("./target/debug/app.exe").unwrap();
  }
  else {
    pe_file = VecPE::from_disk_file("pass-lab-tauri.exe").unwrap();
  }

  let section_table = pe_file.get_section_table().unwrap();

  let mut hasher = Sha256::new();
  hasher.update(section_table[0].read(&pe_file).unwrap());
  let text_dot_hash = hasher.finalize();

  let mut buf = [0u8; 256];
  let based_hash = Base64::encode(&text_dot_hash, &mut buf).unwrap();

  println!("{:?}",based_hash);

  fn win_str(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
  }
  
  /* if based_hash != ETALON_HASH {
    unsafe { MessageBoxW(0x0000, win_str("Ваше приложение было пропатчено!").as_ptr(), win_str("Внимание").as_ptr(), MB_ICONERROR); };
    exit(-2)
  } */

  match child {
    Ok(mut satellite) => {
      println!("{:?}",check_debug()); 

      tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_debug, check_login, exit_app, read_database, dev_write_data, start_process, save_data, save_copy])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

        satellite.kill();
    },
    Err(..) => {
      exit(-1);
    }
  }
}

#[tauri::command]
fn exit_app() {
  std::process::exit(-1)
}

#[tauri::command]
fn check_debug() -> bool {
  unsafe{
    return IsDebuggerPresent().as_bool();
  }
}

#[tauri::command]
fn check_login(login_string:String)-> i32 {
  let b = path::Path::new("master.key").exists();

  let mut hasher = Sha256::new();
  hasher.update(login_string.as_bytes());
  let result_array = hasher.finalize();
  let mut buf = [0u8; 256];
  let hex_hash = Base64::encode(&result_array, &mut buf).unwrap();

  if b == true {
    let file_string = read_to_string("master.key");
    if file_string.unwrap() == hex_hash {
      return 1.into()
    }
    else {
      return (-1).into()
    }
  }
  else {
    let mut new_file = File::create("master.key").unwrap();
    write!(new_file, "{}",hex_hash).unwrap();

    return 2.into()
  }
}

#[tauri::command]
fn read_database () -> String {
  let data_string = read_to_string("data.json");

  match data_string {
    Ok(data_str) => return data_str,
    Err(..) => return "Error".to_string()
  };
}

#[tauri::command]
fn save_data (data:String) -> bool {
  let data_file = std::fs::File::create("data.json");

  match data_file {
      Ok(mut good_file) =>{
        write!(good_file, "{}",data).unwrap();
        return true;
      },
      Err(..) =>{
        return false
      }
  }
}

#[tauri::command]
fn save_copy (data:String, file_name:String) -> bool {
  let mut base_dir = "";

  if cfg!(debug_assertions){
    base_dir = "target/debug/saves";
  }
  else{
    base_dir = "saves";
  }

  if !std::path::Path::new(base_dir).exists(){
    std::fs::create_dir(base_dir); 
  }

  let mut full_file = base_dir.to_string() + "/" + file_name.as_str();

  let full_file_path = std::path::Path::new(full_file.as_str());

  println!("{:?}", full_file_path);

  let new_file = File::create(full_file_path);

  println!("{:?}",new_file);

  match new_file {
    Ok(mut good_file) =>{
      write!(good_file, "{}",data).unwrap();
      return true;
    },
    Err(..) =>{
      return false
    }
  }
}

#[tauri::command]
fn dev_write_data (data:String) {
  let mut new_file = File::create("data_dev.data").unwrap();

  
}

#[tauri::command]
fn start_process () {
  Command::new("cmd").spawn().expect("lol");
}