import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'MotoShop' })
  site_name: string;

  @Column({ default: '0339886769' })
  phone: string;

  @Column({ default: 'buiminhquan12082003@gmail.com' })
  email: string;

  @Column({ default: 'Thôn An Hòa, Xã Tam An, TP.Đà Nẵng' })
  address: string;

  @Column({ default: 'https://www.facebook.com/share/1C6edfa7SN/' })
  facebook_url: string;

  @Column({ default: 'https://youtube.com/@quanbui2507?si=4WSTdar01MDoCAyE' })
  youtube_url: string;

  @Column({ default: 'https://www.instagram.com/direct/inbox/' })
  instagram_url: string;

  @Column({ default: 'https://zalo.me/0339886769' })
  zalo_url: string;

  @Column({ default: '© 2026 MotoShop Vietnam. All rights reserved.' })
  footer_text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
