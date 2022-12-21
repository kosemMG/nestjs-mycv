import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];

  @AfterInsert()
  public logInsert(): void {
    console.log('Inserted user with ID:', this.id);
  }

  @AfterUpdate()
  public logUpdate(): void {
    console.log('Updated user with ID:', this.id);
  }

  @AfterRemove()
  public logRemove(): void {
    console.log('Removed user with ID:', this.id);
  }
}