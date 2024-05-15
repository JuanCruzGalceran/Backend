class UserRepository {
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  create = user => {
    return this.UserRepository.create(user);
  };

  getBy = filter => {
    return this.UserRepository.getBy(filter);
  };
}

export default UserRepository;
