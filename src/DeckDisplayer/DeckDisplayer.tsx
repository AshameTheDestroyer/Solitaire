import React, { useState, useEffect, } from "react";

import Card, { Deck } from "../Classes/Card";
import CardElement from "../Card/CardElement";
import CardType from "../Classes/CardType";
import CardDigit from "../Classes/CardDigit";
import "../Classes/GroupByImplementaion";

import "./DeckDisplayer.scss";
import LinkButton from "../LinkButton/LinkButton";

export default function DeckDisplayer() {
    const [GroupingPredicate, setGroupingPredicate] = useState<(card: Card) => any>();

    useEffect(() => {
        setGroupingPredicate(
            (value: React.SetStateAction<((card: Card) => any) | undefined>) =>
                (card: Card): any => card.type);
        console.log(GroupingPredicate);
    }, []);

    return (
        <main id="deck-displayer">
            <Header setGroupingPredicate={setGroupingPredicate} />
            <GroupDisplayer GroupingPredicate={GroupingPredicate} />
        </main>
    );
}

type HeaderProps = {
    setGroupingPredicate: React.Dispatch<
        React.SetStateAction<((card: Card) => any) | undefined>>;
};

function Header({
    setGroupingPredicate
}: HeaderProps) {
    function ButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, property: String) {
        const GROUPING_BUTTONS =
            document.querySelectorAll(".grouping-button");

        GROUPING_BUTTONS.forEach(groupingButton =>
            groupingButton.classList.remove("selected"));

        e.currentTarget.classList.add("selected");

        setGroupingPredicate((value: React.SetStateAction<((card: Card) => any) | undefined>) =>
            // @ts-ignore
            (card: Card): any => card[property]);
    }

    return (
        <header>
            <section>
                <h1>Card Deck</h1>
                <LinkButton text="Home" href="/" />
            </section>

            <nav> {
                Object.getOwnPropertyNames(new Card({ digit: CardDigit.Ace, type: CardType.Heart }))
                    .map((property, i) =>
                        <button className={`grouping-button ${i == 1 ? "selected" : ""}`}
                            key={property}
                            onClick={e => ButtonClick(e, property)}>
                            {property}
                        </button>
                    )
            } </nav>
        </header>
    );
}

type GroupDisplayerProps = {
    GroupingPredicate: (card: Card) => any;
};

function GroupDisplayer({
    GroupingPredicate,
}: GroupDisplayerProps) {
    if (!GroupingPredicate) { return (<></>); }

    return (
        <section id="group-displayer"> {
            Array.from(Deck.groupBy(GroupingPredicate))
                .map(([groupingFactor, cards], i) =>
                    <section key={i}>
                        <h1>{groupingFactor}</h1>
                        <div> {
                            cards.map(card =>
                                <CardElement card={card} key={`${card.digit} ${card.type}`} />)
                        } </div>
                    </section>
                )
        } </section>
    );
}