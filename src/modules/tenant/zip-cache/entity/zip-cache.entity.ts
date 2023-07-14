import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('zip_cache')
export class ZipCache {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  url: string;

  @Column({ default: 0 })
  progress: number;

  constructor(id: string) {
    this.id = id;
  }
}
