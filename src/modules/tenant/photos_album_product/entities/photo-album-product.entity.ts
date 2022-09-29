import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AlbumPhoto } from '../../album_photos/entities/album.entity';

@Entity('albumphotoproduct')
export class PhotoAlbumProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  photo: string;

  @Column({ nullable: true })
  feature_photo?: boolean;

  @ManyToOne(() => AlbumPhoto)
  @JoinColumn({ name: 'album_photos_id' })
  album_photos_id: AlbumPhoto;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
