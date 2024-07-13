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

  updateLastConnection = uid => {
    return this.UserRepository.updateLastConnection(uid);
  };

  updateDocuments = (userId, documents) => {
    return this.UserRepository.updateDocuments(userId, documents);
  }
}

export default UserRepository;
