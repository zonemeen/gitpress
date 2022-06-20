import { exec } from '@actions/exec'
import buffer from 'buffer'

const output = { stdout: '', stderr: '' }

export async function execute(
  cmd: string,
  cwd: string,
  silent = false,
  ignoreReturnCode = false
) {
  output.stdout = ''
  output.stderr = ''

  await exec(cmd, [], {
    silent,
    cwd,
    listeners: {
      stdout,
      stderr
    },
    ignoreReturnCode
  })

  return Promise.resolve(output)
}

export function stdout(data: Buffer | string) {
  const dataString = data.toString().trim()
  if (
    output.stdout.length + dataString.length <
    buffer.constants.MAX_STRING_LENGTH
  ) {
    output.stdout += dataString
  }
}

export function stderr(data: Buffer | string) {
  const dataString = data.toString().trim()
  if (
    output.stderr.length + dataString.length <
    buffer.constants.MAX_STRING_LENGTH
  ) {
    output.stderr += dataString
  }
}
