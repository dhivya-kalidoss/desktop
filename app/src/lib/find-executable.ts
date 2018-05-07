import { spawn } from 'child_process'
import * as Path from 'path'

export function isExecutableOnPath(executableName: string): Promise<boolean> {
  // adapted from http://stackoverflow.com/a/34953561/1363815
  if (__WIN32__) {
    return new Promise<boolean>((resolve, reject) => {
      const windowsRoot = process.env.SystemRoot || 'C:\\Windows'
      const wherePath = Path.join(windowsRoot, 'System32', 'where.exe')

      const cp = spawn(wherePath, [executableName])

      cp.on('error', error => {
        log.warn('Unable to spawn where.exe', error)
        resolve(false)
      })

      // `where` will return 0 when the executable
      // is found under PATH, or 1 if it cannot be found
      cp.on('close', function(code) {
        resolve(code === 0)
      })
      return
    })
  }

  if (__LINUX__ || __DARWIN__) {
    return new Promise<boolean>((resolve, reject) => {
      const process = spawn('which', [executableName])

      // `which` will return 0 when the executable
      // is found under PATH, or 1 if it cannot be found
      process.on('close', function(code) {
        resolve(code === 0)
      })
    })
  }

  return Promise.resolve(false)
}
