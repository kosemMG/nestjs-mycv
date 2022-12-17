import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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