import { isNil, clone } from "ramda"
import { err } from "../../lib/utils"
import { validate } from "../../lib/validate"
import { executeCron } from "../../lib/cron"
export const addCron = async (state, action, signer) => {
  signer ||= await validate(state, action, "addCron")
  if (action.caller !== state.owner) err()
  if (isNil(state.crons)) {
    state.crons = { lastExecuted: SmartWeave.block.timestamp, crons: {} }
  }
  const [cron, key] = action.input.query
  let _cron = clone(cron)
  if (isNil(_cron.start)) {
    _cron.start = SmartWeave.block.timestamp
  }
  if (SmartWeave.block.timestamp > _cron.start) {
    err("start cannot be before the block time")
  }
  if (!isNil(_cron.end) && SmartWeave.block.timestamp > _cron.end) {
    err("end cannot be before start")
  }
  if (isNil(_cron.jobs) || _cron.jobs.length === 0) {
    err("cron has no jobs")
  }
  if (isNil(_cron.span) || Number.isNaN(_cron.span * 1) || _cron.span <= 0) {
    err("span must be greater than 0")
  }
  state.crons.crons[key] = _cron
  if (_cron.do) {
    try {
      await executeCron({ start: _cron.start, crons: _cron }, state)
    } catch (e) {
      console.log(e)
      err("cron failed to execute")
    }
  }
  return { state }
}
