#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, String, Vec};

#[contracttype]
pub enum DataKey {
    Admin,
    Question,
    Options,
    Votes,
    Voters,
    TotalVotes,
}

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    pub fn initialize(env: Env, admin: Address, question: String, options: Vec<String>) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Question, &question);
        env.storage().instance().set(&DataKey::Options, &options);
        env.storage().instance().set(&DataKey::TotalVotes, &0u32);
        
        let mut initial_votes: Map<u32, u32> = Map::new(&env);
        for i in 0..options.len() {
            initial_votes.set(i, 0);
        }
        env.storage().instance().set(&DataKey::Votes, &initial_votes);
        
        let empty_voters: Map<Address, bool> = Map::new(&env);
        env.storage().instance().set(&DataKey::Voters, &empty_voters);

        let option_count = options.len() as u32;
        env.events().publish((symbol_short!("init"),), (question, option_count));
    }

    pub fn vote(env: Env, voter: Address, option_index: u32) {
        voter.require_auth();

        let mut voters: Map<Address, bool> = env.storage().instance().get(&DataKey::Voters).unwrap();
        if voters.get(voter.clone()).unwrap_or(false) {
            panic!("Already voted");
        }

        let options: Vec<String> = env.storage().instance().get(&DataKey::Options).unwrap();
        if option_index >= options.len() {
            panic!("Invalid option index");
        }

        let mut votes: Map<u32, u32> = env.storage().instance().get(&DataKey::Votes).unwrap();
        let current_votes = votes.get(option_index).unwrap_or(0);
        votes.set(option_index, current_votes + 1);
        env.storage().instance().set(&DataKey::Votes, &votes);

        voters.set(voter.clone(), true);
        env.storage().instance().set(&DataKey::Voters, &voters);

        let total_votes: u32 = env.storage().instance().get(&DataKey::TotalVotes).unwrap_or(0) + 1;
        env.storage().instance().set(&DataKey::TotalVotes, &total_votes);

        // Emit vote_cast(voter_address, option_index, new_total)
        env.events().publish((symbol_short!("vote_cast"),), (voter, option_index, total_votes));
    }

    pub fn get_results(env: Env) -> Vec<(String, u32)> {
        let options: Vec<String> = env.storage().instance().get(&DataKey::Options).unwrap_or_else(|| Vec::new(&env));
        let votes: Map<u32, u32> = env.storage().instance().get(&DataKey::Votes).unwrap_or_else(|| Map::new(&env));
        
        let mut results: Vec<(String, u32)> = Vec::new(&env);
        for i in 0..options.len() {
            let vote_count = votes.get(i).unwrap_or(0);
            results.push_back((options.get(i).unwrap(), vote_count));
        }
        results
    }

    pub fn get_question(env: Env) -> String {
        env.storage().instance().get(&DataKey::Question).unwrap_or_else(|| String::from_str(&env, "Not Initialized"))
    }

    pub fn get_total_votes(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::TotalVotes).unwrap_or(0)
    }

    pub fn has_voted(env: Env, voter: Address) -> bool {
        let voters: Map<Address, bool> = env.storage().instance().get(&DataKey::Voters).unwrap_or_else(|| Map::new(&env));
        voters.get(voter).unwrap_or(false)
    }
}
