#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows",
  )]

use windows::Win32::Foundation::GetLastError;
use windows::{
    Win32::System::Diagnostics::Debug::*
};
use std::env;
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();
    let pid:u32 = args[1].parse::<u32>().unwrap();

    unsafe{
        let is_attached = DebugActiveProcess(pid).as_bool();

        if !is_attached {
            let last_error = GetLastError();
            println!("Last Error {:?}", last_error);
            process::exit(-1)
        }

        let mut dbg_event:DEBUG_EVENT = Default::default();

        loop {
            WaitForDebugEvent(&mut dbg_event, u32::MAX);
            ContinueDebugEvent(dbg_event.dwProcessId, dbg_event.dwThreadId, 65538);
       }
    }
}
