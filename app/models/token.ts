import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare value: number

  @column()
  declare code: string

  @column()
  @hasOne(() => User)
  declare claimedBy: relations.HasOne<typeof User>

  @column()
  @hasOne(() => User)
  declare targetTo: relations.HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
